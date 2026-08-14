import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { getAuthenticatedUser } from "@/lib/auth";

export async function GET() {
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

    const items =
      await db
        .collection("filesystem")
        .find({
          ownerId: user.id,
        })
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