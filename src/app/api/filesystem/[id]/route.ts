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

  const session = await db.collection("sessions").findOne({
    tokenHash,
  });

  if (!session) {
    return null;
  }

  if (session.expiresAt < new Date()) {
    await db.collection("sessions").deleteOne({
      _id: session._id,
    });

    return null;
  }

  const user = await db.collection("users").findOne({
    _id: new ObjectId(session.userId),
  });

  if (!user) {
    return null;
  }

  return {
    id: user._id.toString(),
    username: user.username,
  };
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const isRecycle =
      searchParams.get("recycle") === "true";

    const parentId =
      searchParams.get("parentId");

    const client =
      await clientPromise;

    const db =
      client.db("sefirah");

    const query: any = isRecycle
      ? {
        deletedAt: {
          $ne: null,
        },
      }
      : {
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

function getQueryId(id: string) {
  return ObjectId.isValid(id)
    ? new ObjectId(id)
    : id;
}

/*
 * =========================================================
 * DELETE
 * =========================================================
 */

export async function DELETE(
  request: Request,
  { params }: RouteContext
) {
  try {
    const { id } = await params;

    const client =
      await clientPromise;

    const db =
      client.db("sefirah");

    const queryId =
      getQueryId(id);

    /*
     * =========================================================
     * FIND ITEM
     * =========================================================
     */

    const item =
      await db
        .collection("filesystem")
        .findOne({
          $or: [
            {
              _id: queryId,
            },
            {
              id: id,
            },
          ],
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
     * =========================================================
     * SOFT DELETE ROOT ITEM
     * =========================================================
     */

    const deletedAt =
      new Date().toISOString();

    const originalParentId =
      item.parentId ?? null;

    await db
      .collection("filesystem")
      .updateOne(
        {
          _id: item._id,
        },
        {
          $set: {
            deletedAt,
            originalParentId,
            parentId: null,
          },
        }
      );

    /*
     * =========================================================
     * SOFT DELETE DESCENDANTS
     * =========================================================
     *
     * Folders can contain folders, so we walk
     * the hierarchy recursively.
     */

    if (item.type === "folder") {
      const descendants: string[] = [];

      let currentParentIds = [
        item._id.toString(),
      ];

      while (
        currentParentIds.length > 0
      ) {
        const children =
          await db
            .collection("filesystem")
            .find({
              parentId: {
                $in:
                  currentParentIds,
              },

              ownerId:
                item.ownerId,
            })
            .toArray();

        if (
          children.length === 0
        ) {
          break;
        }

        const nextParentIds: string[] =
          [];

        for (const child of children) {
          descendants.push(
            child._id.toString()
          );

          if (
            child.type ===
            "folder"
          ) {
            nextParentIds.push(
              child._id.toString()
            );
          }
        }

        currentParentIds =
          nextParentIds;
      }

      /*
       * Mark every descendant
       * as deleted.
       *
       * Their existing parentId
       * relationships are preserved.
       */

      if (
        descendants.length > 0
      ) {
        await db
          .collection("filesystem")
          .updateMany(
            {
              _id: {
                $in:
                  descendants.map(
                    (childId) =>
                      new ObjectId(
                        childId
                      )
                  ),
              },

              ownerId:
                item.ownerId,
            },
            {
              $set: {
                deletedAt,
              },
            }
          );
      }
    }

    return NextResponse.json({
      success: true,

      item: {
        ...item,

        deletedAt,

        originalParentId,

        parentId:
          null,
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
 * RESTORE
 * =========================================================
 */

export async function PATCH(
  request: Request,
  { params }: RouteContext
) {
  try {
    const { id } = await params;

    const body =
      await request.json();

    const client =
      await clientPromise;

    const db =
      client.db("sefirah");

    const queryId =
      getQueryId(id);

    /*
     * =========================================================
     * RESTORE
     * =========================================================
     */

    if (body.restore) {
      const item =
        await db
          .collection("filesystem")
          .findOne({
            $or: [
              {
                _id: queryId,
              },
              {
                id: id,
              },
            ],
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
       * =======================================================
       * FIND ORIGINAL PARENT
       * =======================================================
       */

      let newParentId =
        item.originalParentId ??
        null;

      if (newParentId) {
        const originalParent =
          await db
            .collection("filesystem")
            .findOne({
              _id:
                getQueryId(
                  newParentId
                ),

              ownerId:
                item.ownerId,

              deletedAt: {
                $exists: false,
              },
            });

        /*
         * Original folder no longer
         * exists or is deleted.
         *
         * Restore to Home instead.
         */

        if (!originalParent) {
          newParentId = null;
        }
      }

      /*
       * =======================================================
       * RESTORE SELECTED ITEM
       * =======================================================
       */

      await db
        .collection("filesystem")
        .updateOne(
          {
            _id: item._id,
          },
          {
            $set: {
              parentId:
                newParentId,

              updatedAt:
                new Date(),
            },

            $unset: {
              deletedAt: "",
              originalParentId: "",
            },
          }
        );

      /*
       * =======================================================
       * RESTORE DESCENDANTS
       * =======================================================
       *
       * If the restored item is a folder,
       * restore all descendants that were
       * deleted with it.
       */

      if (item.type === "folder") {
        const descendants: string[] = [];

        let currentParentIds = [
          item._id.toString(),
        ];

        while (
          currentParentIds.length > 0
        ) {
          const children =
            await db
              .collection("filesystem")
              .find({
                parentId: {
                  $in:
                    currentParentIds,
                },

                ownerId:
                  item.ownerId,

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

          const nextParentIds: string[] =
            [];

          for (const child of children) {
            descendants.push(
              child._id.toString()
            );

            if (
              child.type ===
              "folder"
            ) {
              nextParentIds.push(
                child._id.toString()
              );
            }
          }

          currentParentIds =
            nextParentIds;
        }

        if (
          descendants.length > 0
        ) {
          await db
            .collection("filesystem")
            .updateMany(
              {
                _id: {
                  $in:
                    descendants.map(
                      (childId) =>
                        new ObjectId(
                          childId
                        )
                    ),
                },

                ownerId:
                  item.ownerId,

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
                    new Date(),
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

          parentId:
            newParentId,

          deletedAt:
            null,

          originalParentId:
            null,
        },
      });
    }

    /*
     * =========================================================
     * INVALID ACTION
     * =========================================================
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