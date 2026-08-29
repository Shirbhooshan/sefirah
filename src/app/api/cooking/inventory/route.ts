import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { getAuthenticatedUser } from "@/lib/auth";
import { ObjectId } from "mongodb";

/*
 * =========================================================
 * TYPES
 * =========================================================
 */

interface CookingProgress {
    _id?: ObjectId;

    ownerId: string;

    recipe: string;

    inventory: Record<string, number>;

    checklist: Record<string, boolean>;

    createdAt: Date;

    updatedAt: Date;
}

/*
 * =========================================================
 * GET INVENTORY
 * =========================================================
 *
 * Returns the current cooking inventory for the logged-in
 * user.
 *
 * If the user doesn't have a cooking progress document yet,
 * one is created automatically.
 */

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

        const inventoryCollection =
            db.collection<CookingProgress>(
                "cookingProgress"
            );

        const userId =
            String(user.id);

        /*
         * =====================================================
         * FIND EXISTING PROGRESS
         * =====================================================
         */

        let progress =
            await inventoryCollection.findOne({
                ownerId: userId,
            });

        /*
         * =====================================================
         * CREATE INITIAL PROGRESS
         * =====================================================
         */

        if (!progress) {
            const now =
                new Date();

            const newProgress:
                CookingProgress = {
                    ownerId: userId,

                    recipe:
                        "fried_rice",

                    inventory: {},

                    checklist: {},

                    createdAt:
                        now,

                    updatedAt:
                        now,
                };

            const result =
                await inventoryCollection.insertOne(
                    newProgress
                );

            /*
             * Build the same document that MongoDB now
             * contains, including its generated _id.
             *
             * This also guarantees TypeScript knows that
             * progress cannot be null after this branch.
             */

            progress = {
                ...newProgress,

                _id:
                    result.insertedId,
            };
        }

        /*
         * =====================================================
         * RESPONSE
         * =====================================================
         */

        return NextResponse.json({
            success: true,

            inventory:
                progress.inventory ?? {},

            checklist:
                progress.checklist ?? {},

            recipe:
                progress.recipe ??
                "fried_rice",
        });

    } catch (error) {
        console.error(
            "GET /api/cooking/inventory error:",
            error
        );

        return NextResponse.json(
            {
                success: false,
                message:
                    "Failed to load cooking inventory",
            },
            { status: 500 }
        );
    }
}


/*
 * =========================================================
 * PATCH INVENTORY
 * =========================================================
 *
 * Body:
 *
 * {
 *   ingredient: "carrot",
 *   quantity: 1
 * }
 *
 * This sets the quantity rather than incrementing it.
 *
 * The frontend is responsible for making sure the quantity
 * doesn't exceed the recipe requirement.
 */

export async function PATCH(
    request: Request
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

        /*
         * =====================================================
         * PARSE REQUEST
         * =====================================================
         */

        const body =
            await request.json();

        const {
            ingredient,
            quantity,
        } = body;

        /*
         * =====================================================
         * VALIDATE REQUEST
         * =====================================================
         */

        if (
            typeof ingredient !==
                "string" ||
            ingredient.trim() === "" ||
            typeof quantity !==
                "number" ||
            !Number.isFinite(
                quantity
            ) ||
            quantity < 0
        ) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "Invalid inventory data",
                },
                { status: 400 }
            );
        }

        const client =
            await clientPromise;

        const db =
            client.db("sefirah");

        const inventoryCollection =
            db.collection<CookingProgress>(
                "cookingProgress"
            );

        const userId =
            String(user.id);

        const now =
            new Date();

        /*
         * =====================================================
         * UPDATE / CREATE PROGRESS
         * =====================================================
         *
         * If the player already has a progress document,
         * update only the requested ingredient.
         *
         * If they don't, create the progress document and
         * set the requested ingredient immediately.
         */

        await inventoryCollection.updateOne(
            {
                ownerId:
                    userId,
            },

            {
                $set: {
                    [`inventory.${ingredient}`]:
                        quantity,

                    updatedAt:
                        now,
                },

                $setOnInsert: {
                    ownerId:
                        userId,

                    recipe:
                        "fried_rice",

                    checklist:
                        {},

                    createdAt:
                        now,
                },
            },

            {
                upsert:
                    true,
            }
        );

        /*
         * =====================================================
         * RESPONSE
         * =====================================================
         */

        return NextResponse.json({
            success: true,

            ingredient,

            quantity,
        });

    } catch (error) {
        console.error(
            "PATCH /api/cooking/inventory error:",
            error
        );

        return NextResponse.json(
            {
                success: false,
                message:
                    "Failed to update cooking inventory",
            },
            { status: 500 }
        );
    }
}
