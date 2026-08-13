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

export async function GET(
  request: Request,
  context: RouteContext
) {
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

    const { id } = await context.params;

    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid item ID.",
        },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("sefirah");

    const item = await db.collection("filesystem").findOne({
      _id: new ObjectId(id),
      ownerId: user.id,
    });

    if (!item) {
      return NextResponse.json(
        {
          success: false,
          message: "Item not found.",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      item: {
        id: item._id.toString(),
        name: item.name,
        type: item.type,
        parentId: item.parentId ?? null,
        content: item.type === "file"
          ? item.content ?? ""
          : undefined,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
      },
    });
  } catch (error) {
    console.error(
      "Get filesystem item error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong.",
      },
      { status: 500 }
    );
  }
}

// DELETE
export async function DELETE(
  request: Request,
  context: RouteContext
) {
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

    const { id } = await context.params;

    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid item ID.",
        },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("sefirah");
    const filesystem = db.collection("filesystem");

    const item = await filesystem.findOne({
      _id: new ObjectId(id),
      ownerId: user.id,
    });

    if (!item) {
      return NextResponse.json(
        {
          success: false,
          message: "Item not found.",
        },
        { status: 404 }
      );
    }

    await filesystem.deleteOne({
      _id: new ObjectId(id),
      ownerId: user.id,
    });

    return NextResponse.json({
      success: true,
      message: "Item deleted.",
    });
  } catch (error) {
    console.error(
      "Delete filesystem item error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong.",
      },
      { status: 500 }
    );
  }
}

// PATCH
export async function PATCH(
  request: Request,
  context: RouteContext
) {
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

    const { id } = await context.params;

    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid item ID.",
        },
        { status: 400 }
      );
    }

    const body = await request.json();

    const client = await clientPromise;
    const db = client.db("sefirah");
    const filesystem = db.collection("filesystem");

    // Make sure the item belongs to the current user
    const item = await filesystem.findOne({
      _id: new ObjectId(id),
      ownerId: user.id,
    });

    if (!item) {
      return NextResponse.json(
        {
          success: false,
          message: "Item not found.",
        },
        { status: 404 }
      );
    }

    const update: {
      name?: string;
      parentId?: string | null;
      content?: string;
      updatedAt: Date;
    } = {
      updatedAt: new Date(),
    };

    // -------------------------
    // Rename
    // -------------------------

    if (body.name !== undefined) {
      const name = body.name?.trim();

      if (!name) {
        return NextResponse.json(
          {
            success: false,
            message: "Name cannot be empty.",
          },
          { status: 400 }
        );
      }

      update.name = name;
    }

    // -------------------------
    // Move
    // -------------------------

    if (body.parentId !== undefined) {
      const parentId = body.parentId;

      // null = root
      if (parentId === null) {
        update.parentId = null;
      } else {
        if (
          typeof parentId !== "string" ||
          !ObjectId.isValid(parentId)
        ) {
          return NextResponse.json(
            {
              success: false,
              message: "Invalid parent folder ID.",
            },
            { status: 400 }
          );
        }

        // Destination must belong to the same user
        // and must actually be a folder.
        const parentFolder = await filesystem.findOne({
          _id: new ObjectId(parentId),
          ownerId: user.id,
          type: "folder",
        });

        if (!parentFolder) {
          return NextResponse.json(
            {
              success: false,
              message: "Destination folder not found.",
            },
            { status: 404 }
          );
        }

        // Prevent folder from being moved into itself
        if (parentId === id) {
          return NextResponse.json(
            {
              success: false,
              message: "A folder cannot contain itself.",
            },
            { status: 400 }
          );
        }

        update.parentId = parentId;
      }
    }

    // -------------------------
    // Edit file content
    // -------------------------

    if (body.content !== undefined) {
      if (item.type !== "file") {
        return NextResponse.json(
          {
            success: false,
            message: "Folders cannot have file content.",
          },
          { status: 400 }
        );
      }

      if (typeof body.content !== "string") {
        return NextResponse.json(
          {
            success: false,
            message: "File content must be text.",
          },
          { status: 400 }
        );
      }

      update.content = body.content;
    }

    // -------------------------
    // Nothing to update
    // -------------------------

    if (
      update.name === undefined &&
      update.parentId === undefined &&
      update.content === undefined
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Nothing to update.",
        },
        { status: 400 }
      );
    }

    const result = await filesystem.updateOne(
      {
        _id: new ObjectId(id),
        ownerId: user.id,
      },
      {
        $set: update,
      }
    );

    return NextResponse.json({
      success: true,
      message: "Item updated.",
      matchedCount: result.matchedCount,
      modifiedCount: result.modifiedCount,
      item: {
        id,
        name: update.name ?? item.name,
        parentId:
          update.parentId !== undefined
            ? update.parentId
            : item.parentId ?? null,
        content:
          update.content !== undefined
            ? update.content
            : item.content ?? "",
      },
    });
  } catch (error) {
    console.error(
      "Update filesystem item error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong.",
      },
      { status: 500 }
    );
  }
}