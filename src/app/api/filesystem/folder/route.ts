import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { getAuthenticatedUser } from "@/lib/auth";

export async function POST(request: Request) {
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

    const body = await request.json();

    const name = body.name?.trim();
    const parentId = body.parentId ?? null;

    if (!name) {
      return NextResponse.json(
        {
          success: false,
          message: "Folder name required.",
        },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("sefirah");

    const result = await db
      .collection("filesystem")
      .insertOne({
        ownerId: user.id,
        name,
        type: "folder",
        parentId,
        content: "",
        createdAt: new Date(),
        updatedAt: new Date(),
      });

    return NextResponse.json({
      success: true,
      folder: {
        id: result.insertedId.toString(),
        name,
        parentId,
      },
    });
  } catch (error) {
    console.error("Create folder error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong.",
      },
      { status: 500 }
    );
  }
}