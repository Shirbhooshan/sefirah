import { NextResponse } from "next/server";

import clientPromise from "@/lib/mongodb";
import { getAuthenticatedUser } from "@/lib/auth";

export async function POST(request: Request) {
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

        const body =
            await request.json();

        const name =
            body.name?.trim() ||
            "Untitled";

        const content =
            typeof body.content === "string"
                ? body.content
                : "";

        const client =
            await clientPromise;

        const db =
            client.db("sefirah");

        /*
         * UPDATE EXISTING NOTE
         */

        if (body.itemId) {
            const { ObjectId } =
                await import("mongodb");

            if (
                !ObjectId.isValid(
                    body.itemId
                )
            ) {
                return NextResponse.json(
                    {
                        success: false,
                        message:
                            "Invalid note ID.",
                    },
                    { status: 400 }
                );
            }

            const result =
                await db
                    .collection("filesystem")
                    .findOneAndUpdate(
                        {
                            _id:
                                new ObjectId(
                                    body.itemId
                                ),

                            ownerId:
                                user.id,

                            type: "file",
                        },
                        {
                            $set: {
                                name,
                                content,
                                updatedAt:
                                    new Date(),
                            },
                        },
                        {
                            returnDocument:
                                "after",
                        }
                    );

            if (!result) {
                return NextResponse.json(
                    {
                        success: false,
                        message:
                            "Note not found.",
                    },
                    { status: 404 }
                );
            }

            return NextResponse.json({
                success: true,

                item: {
                    id:
                        result._id.toString(),

                    name:
                        result.name,

                    type:
                        result.type,

                    parentId:
                        result.parentId,

                    content:
                        result.content,
                },
            });
        }

        /*
         * CREATE NEW NOTE
         */

        const result =
            await db
                .collection("filesystem")
                .insertOne({
                    ownerId: user.id,

                    name,

                    type: "file",

                    parentId:
                        body.parentId ??
                        null,

                    content,

                    createdAt:
                        new Date(),

                    updatedAt:
                        new Date(),
                });

        return NextResponse.json({
            success: true,

            item: {
                id:
                    result.insertedId.toString(),

                name,

                type: "file",

                parentId:
                    body.parentId ??
                    null,

                content,
            },
        });
    } catch (error) {
        console.error(
            "Save note error:",
            error
        );

        return NextResponse.json(
            {
                success: false,
                message:
                    "Failed to save note.",
            },
            { status: 500 }
        );
    }
}