import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { getAuthenticatedUser } from "@/lib/auth";

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

        const client = await clientPromise;
        const db = client.db("sefirah");

        const inventoryCollection =
            db.collection("cookingProgress");

        const userId = String(user.id);

        let progress =
            await inventoryCollection.findOne({
                ownerId: userId,
            });

        /*
         * Create the player's cooking progress
         * the first time they enter the cooking game.
         */

        if (!progress) {
            progress = {
                ownerId: userId,

                recipe: "fried_rice",

                inventory: {},

                checklist: {},

                createdAt: new Date(),
                updatedAt: new Date(),
            };

            await inventoryCollection.insertOne(
                progress
            );
        }

        return NextResponse.json({
            success: true,

            inventory:
                progress.inventory ?? {},

            checklist:
                progress.checklist ?? {},

            recipe:
                progress.recipe ?? "fried_rice",
        });

    } catch (error) {
        console.error(
            "GET /api/cooking/inventory error:",
            error
        );

        return NextResponse.json(
            {
                success: false,
                message: "Failed to load cooking inventory",
            },
            { status: 500 }
        );
    }
}


/*
 * =========================================================
 * UPDATE INVENTORY
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

        const {
            ingredient,
            quantity,
        } = body;

        if (
            typeof ingredient !== "string" ||
            typeof quantity !== "number" ||
            quantity < 0
        ) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Invalid inventory data",
                },
                { status: 400 }
            );
        }

        const client = await clientPromise;
        const db = client.db("sefirah");

        const inventoryCollection =
            db.collection("cookingProgress");

        const userId = String(user.id);

        await inventoryCollection.updateOne(
            {
                ownerId: userId,
            },
            {
                $set: {
                    [`inventory.${ingredient}`]:
                        quantity,

                    updatedAt:
                        new Date(),
                },

                $setOnInsert: {
                    ownerId: userId,

                    recipe: "fried_rice",

                    checklist: {},

                    createdAt:
                        new Date(),
                },
            },
            {
                upsert: true,
            }
        );

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