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
    const content = body.content ?? "";
    const parentId = body.parentId ?? null;

    if (!name) {
      return NextResponse.json(
        {
          success: false,
          message: "File name required.",
        },
        { status: 400 }
      );
    }

    if (typeof content !== "string") {
      return NextResponse.json(
        {
          success: false,
          message: "File content must be text.",
        },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("sefirah");

    const filesystem = db.collection("filesystem");

    // If creating inside a folder, verify that folder exists
    if (parentId !== null) {
      const parentFolder = await filesystem.findOne({
        _id: new (await import("mongodb")).ObjectId(parentId),
        ownerId: user.id,
        type: "folder",
      });

      if (!parentFolder) {
        return NextResponse.json(
          {
            success: false,
            message: "Parent folder not found.",
          },
          { status: 404 }
        );
      }
    }

    const result = await filesystem.insertOne({
      ownerId: user.id,
      name,
      type: "file",
      parentId,
      content,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return NextResponse.json({
      success: true,
      message: "File created.",
      file: {
        id: result.insertedId.toString(),
        name,
        type: "file",
        parentId,
        content,
      },
    });
  } catch (error) {
    console.error("Create file error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong.",
      },
      { status: 500 }
    );
  }
}