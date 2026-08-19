import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { getAuthenticatedUser } from "@/lib/auth";

export async function GET(request: Request) {
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

    const client =
      await clientPromise;

    const db =
      client.db("sefirah");

    const { searchParams } =
      new URL(request.url);

    const isRecycle =
      searchParams.get("recycle") === "true";

    const parentId =
      searchParams.get("parentId");

    /*
     * =========================================================
     * RECYCLE BIN
     * =========================================================
     *
     * Return only deleted items belonging
     * to the authenticated user.
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
            deletedAt: -1,
            name: 1,
          })
          .toArray();

      return NextResponse.json({
        success: true,

        items: items.map((item) => ({
          id:
            item._id.toString(),

          name:
            item.name,

          type:
            item.type,

          parentId:
            item.parentId ?? null,

          originalParentId:
            item.originalParentId ??
            null,

          deletedAt:
            item.deletedAt ??
            null,

          content:
            item.content,

          createdAt:
            item.createdAt,

          updatedAt:
            item.updatedAt,
        })),
      });
    }

    /*
     * =========================================================
     * NORMAL FILESYSTEM
     * =========================================================
     *
     * Deleted items must never appear in
     * Home or normal folders.
     */

    const query: any = {
      ownerId: user.id,

      deletedAt: {
        $exists: false,
      },
    };

    /*
     * Root/Home
     *
     * If no parentId was supplied, return
     * root-level items.
     */

    if (parentId) {
      query.parentId = parentId;
    } else {
      query.parentId = null;
    }

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

      items: items.map((item) => ({
        id:
          item._id.toString(),

        name:
          item.name,

        type:
          item.type,

        parentId:
          item.parentId ?? null,

        originalParentId:
          item.originalParentId ??
          null,

        deletedAt:
          item.deletedAt ??
          null,

        content:
          item.content,

        createdAt:
          item.createdAt,

        updatedAt:
          item.updatedAt,
      })),
    });
  } catch (error) {
    console.error(
      "Filesystem fetch error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Something went wrong.",
      },
      { status: 500 }
    );
  }
}