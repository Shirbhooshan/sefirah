import { NextResponse } from "next/server";
import crypto from "crypto";
import { cookies } from "next/headers";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

/*
 * =========================================================
 * AUTHENTICATION
 * =========================================================
 */

function hashToken(token: string) {
  return crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");
}

async function getAuthenticatedUser() {
  const cookieStore = await cookies();

  const sessionToken =
    cookieStore.get("sefirah_session")?.value;

  if (!sessionToken) {
    return null;
  }

  const tokenHash = hashToken(sessionToken);

  const client = await clientPromise;
  const db = client.db("sefirah");

  const session = await db
    .collection("sessions")
    .findOne({
      tokenHash,
    });

  if (!session) {
    return null;
  }

  if (session.expiresAt < new Date()) {
    await db
      .collection("sessions")
      .deleteOne({
        _id: session._id,
      });

    return null;
  }

  const userId = session.userId;

  const user =
    await db
      .collection("users")
      .findOne({
        _id: new ObjectId(userId),
      });

  if (!user) {
    return null;
  }

  return {
    id: user._id.toString(),
    username: user.username,
  };
}

/*
 * =========================================================
 * OBJECT ID HELPERS
 * =========================================================
 */

function getQueryId(id: string): ObjectId | null {
  if (!ObjectId.isValid(id)) {
    return null;
  }

  return new ObjectId(id);
}

function buildItemQuery(id: string) {
  const queryId = getQueryId(id);

  if (queryId) {
    return {
      $or: [
        {
          _id: queryId,
        },
        {
          id,
        },
      ],
    };
  }

  return {
    id,
  };
}

/*
 * =========================================================
 * GET
 *
 * GET /api/filesystem
 * GET /api/filesystem?parentId=...
 * GET /api/filesystem?recycle=true
 * =========================================================
 */

export async function GET(request: Request) {
  try {
    const user = await getAuthenticatedUser();

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        { status: 401 }
      );
    }

    const { searchParams } =
      new URL(request.url);

    const isRecycle =
      searchParams.get("recycle") === "true";

    const parentId =
      searchParams.get("parentId");

    const client =
      await clientPromise;

    const db =
      client.db("sefirah");

    /*
     * =======================================================
     * RECYCLE BIN
     * =======================================================
     */

    if (isRecycle) {
      const items =
        await db
          .collection("filesystem")
          .find({
            ownerId: user.id,

            deletedAt: {
              $exists: true,
              $ne: null,
            },
          })
          .sort({
            type: -1,
            name: 1,
          })
          .toArray();

      return NextResponse.json({
        success: true,
        items,
      });
    }

    /*
     * =======================================================
     * NORMAL FILESYSTEM
     *
     * Old documents may not have deletedAt.
     * Therefore we explicitly allow:
     *
     * deletedAt doesn't exist
     * OR
     * deletedAt === null
     * =======================================================
     */

    const query = {
      ownerId: user.id,

      $or: [
        {
          deletedAt: {
            $exists: false,
          },
        },
        {
          deletedAt: null,
        },
      ],

      parentId:
        parentId ?? null,
    };

    const items =
      await db
        .collection("filesystem")
        .find(query)
        .sort({
          type: -1,
          name: 1,
        })
        .toArray();

    return NextResponse.json({
      success: true,
      items,
    });
  } catch (error) {
    console.error(
      "GET filesystem error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Failed to fetch items",
      },
      { status: 500 }
    );
  }
}

/*
 * =========================================================
 * DELETE
 *
 * Normal delete = SOFT DELETE
 *
 * The item is moved into Recycle Bin rather than
 * permanently removed from MongoDB.
 * =========================================================
 */

export async function DELETE(
  request: Request,
  { params }: RouteContext
) {
  try {
    const user =
      await getAuthenticatedUser();

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        { status: 401 }
      );
    }

    const { id } =
      await params;

    const client =
      await clientPromise;

    const db =
      client.db("sefirah");

    /*
     * =======================================================
     * FIND ITEM
     * =======================================================
     */

    const item =
      await db
        .collection("filesystem")
        .findOne({
          ...buildItemQuery(id),
          ownerId: user.id,
        });

    if (!item) {
      return NextResponse.json(
        {
          success: false,
          message: "Item not found",
        },
        { status: 404 }
      );
    }

    /*
     * =======================================================
     * SOFT DELETE ROOT ITEM
     * =======================================================
     */

    const deletedAt =
      new Date();

    const originalParentId =
      item.parentId ?? null;

    await db
      .collection("filesystem")
      .updateOne(
        {
          _id: item._id,
          ownerId: user.id,
        },
        {
          $set: {
            deletedAt,
            originalParentId,
            parentId: null,
            updatedAt: deletedAt,
          },
        }
      );

    /*
     * =======================================================
     * SOFT DELETE DESCENDANTS
     * =======================================================
     *
     * If the deleted item is a folder, every child
     * underneath it is also moved into the deleted state.
     *
     * Their parentId relationships are preserved so that
     * the hierarchy can be reconstructed on restore.
     * =======================================================
     */

    if (item.type === "folder") {
      const descendants: ObjectId[] = [];

      let currentParentIds: ObjectId[] = [
        item._id,
      ];

      while (
        currentParentIds.length > 0
      ) {
        const children =
          await db
            .collection("filesystem")
            .find({
              parentId: {
                $in: currentParentIds.map(
                  (parentId) =>
                    parentId.toString()
                ),
              },

              ownerId: user.id,

              /*
               * Don't include already deleted items.
               */
              deletedAt: {
                $exists: false,
              },
            })
            .toArray();

        if (children.length === 0) {
          break;
        }

        const nextParentIds: ObjectId[] = [];

        for (const child of children) {
          descendants.push(
            child._id
          );

          if (
            child.type === "folder"
          ) {
            nextParentIds.push(
              child._id
            );
          }
        }

        currentParentIds =
          nextParentIds;
      }

      /*
       * Mark descendants as deleted.
       *
       * IMPORTANT:
       * We intentionally DO NOT change parentId here.
       */

      if (
        descendants.length > 0
      ) {
        await db
          .collection("filesystem")
          .updateMany(
            {
              _id: {
                $in: descendants,
              },

              ownerId: user.id,
            },
            {
              $set: {
                deletedAt,
                updatedAt: deletedAt,
              },
            }
          );
      }
    }

    /*
     * =======================================================
     * RESPONSE
     * =======================================================
     */

    return NextResponse.json({
      success: true,

      item: {
        ...item,

        deletedAt,

        originalParentId,

        parentId: null,
      },
    });
  } catch (error) {
    console.error(
      "DELETE error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Failed to delete item",
      },
      { status: 500 }
    );
  }
}

/*
 * =========================================================
 * PATCH
 *
 * Currently supports:
 *
 * {
 *   restore: true
 * }
 *
 * =========================================================
 */

export async function PATCH(
  request: Request,
  { params }: RouteContext
) {
  try {
    const user =
      await getAuthenticatedUser();

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        { status: 401 }
      );
    }

    const { id } =
      await params;

    const body =
      await request.json();

    const client =
      await clientPromise;

    const db =
      client.db("sefirah");

    /*
     * =======================================================
     * RESTORE
     * =======================================================
     */

    if (body.restore) {
      const item =
        await db
          .collection("filesystem")
          .findOne({
            ...buildItemQuery(id),
            ownerId: user.id,
          });

      if (!item) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Item not found",
          },
          { status: 404 }
        );
      }

      /*
       * =====================================================
       * FIND ORIGINAL PARENT
       * =====================================================
       */

      let newParentId =
        item.originalParentId ??
        null;

      if (newParentId) {
        const parentQueryId =
          getQueryId(
            newParentId.toString()
          );

        let originalParent = null;

        if (parentQueryId) {
          originalParent =
            await db
              .collection("filesystem")
              .findOne({
                _id:
                  parentQueryId,

                ownerId:
                  user.id,

                /*
                 * Parent must currently
                 * exist outside Recycle Bin.
                 */
                $or: [
                  {
                    deletedAt: {
                      $exists: false,
                    },
                  },
                  {
                    deletedAt: null,
                  },
                ],
              });
        } else {
          /*
           * Support legacy string IDs.
           */

          originalParent =
            await db
              .collection("filesystem")
              .findOne({
                id: newParentId,

                ownerId:
                  user.id,

                $or: [
                  {
                    deletedAt: {
                      $exists: false,
                    },
                  },
                  {
                    deletedAt: null,
                  },
                ],
              });
        }

        /*
         * Original folder no longer exists
         * or is itself deleted.
         *
         * Restore to Home instead.
         */

        if (!originalParent) {
          newParentId = null;
        }
      }

      /*
       * =====================================================
       * RESTORE SELECTED ITEM
       * =====================================================
       */

      const restoreTime =
        new Date();

      await db
        .collection("filesystem")
        .updateOne(
          {
            _id: item._id,
            ownerId: user.id,
          },
          {
            $set: {
              parentId:
                newParentId,

              updatedAt:
                restoreTime,
            },

            $unset: {
              deletedAt: "",
              originalParentId: "",
            },
          }
        );

      /*
       * =====================================================
       * RESTORE DESCENDANTS
       * =====================================================
       *
       * If the selected item is a folder, restore its
       * descendants too.
       *
       * Their original parentId values were preserved
       * during deletion.
       * =====================================================
       */

      if (
        item.type === "folder"
      ) {
        const descendants: ObjectId[] = [];

        let currentParentIds: ObjectId[] = [
          item._id,
        ];

        while (
          currentParentIds.length > 0
        ) {
          const children =
            await db
              .collection("filesystem")
              .find({
                parentId: {
                  $in: currentParentIds.map(
                    (parentId) =>
                      parentId.toString()
                  ),
                },

                ownerId: user.id,

                deletedAt: {
                  $exists: true,
                  $ne: null,
                },
              })
              .toArray();

          if (
            children.length === 0
          ) {
            break;
          }

          const nextParentIds: ObjectId[] = [];

          for (const child of children) {
            descendants.push(
              child._id
            );

            if (
              child.type === "folder"
            ) {
              nextParentIds.push(
                child._id
              );
            }
          }

          currentParentIds =
            nextParentIds;
        }

        /*
         * Restore descendants.
         *
         * We don't change parentId because their original
         * hierarchy was preserved during deletion.
         */

        if (
          descendants.length > 0
        ) {
          await db
            .collection("filesystem")
            .updateMany(
              {
                _id: {
                  $in: descendants,
                },

                ownerId: user.id,

                deletedAt: {
                  $exists: true,
                  $ne: null,
                },
              },
              {
                $unset: {
                  deletedAt: "",
                  originalParentId: "",
                },

                $set: {
                  updatedAt:
                    restoreTime,
                },
              }
            );
        }
      }

      /*
       * =====================================================
       * RESPONSE
       * =====================================================
       */

      return NextResponse.json({
        success: true,

        item: {
          ...item,

          parentId:
            newParentId,

          deletedAt: null,

          originalParentId: null,
        },
      });
    }

    /*
     * =======================================================
     * INVALID ACTION
     * =======================================================
     */

    return NextResponse.json(
      {
        success: false,
        message:
          "Invalid action",
      },
      { status: 400 }
    );
  } catch (error) {
    console.error(
      "PATCH error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Failed to restore item",
      },
      { status: 500 }
    );
  }
}
