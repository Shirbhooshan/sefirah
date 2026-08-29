import { NextResponse } from "next/server";
import CookingProgress from "@/lib/models/CookingProgress";
import { connectDB } from "@/lib/mongodb";

const RECIPE_ID = "fried-rice";

const DEFAULT_INVENTORY = {
  greenOnion: 0,
  egg: 0,
  carrot: 0,
  onion: 0,
  garlic: 0,
  rice: 0,
  oil: 0,
  soySauce: 0,
};

const DEFAULT_CHECKLIST = {
  greenOnion: { required: 1, collected: 0 },
  egg: { required: 2, collected: 0 },
  carrot: { required: 1, collected: 0 },
  onion: { required: 1, collected: 0 },
  garlic: { required: 1, collected: 0 },
};

export async function GET() {
  try {
    await connectDB();

    const ownerId = "CURRENT_USER_ID";

    let progress = await CookingProgress.findOne({
      ownerId,
      recipeId: RECIPE_ID,
    });

    if (!progress) {
      progress = await CookingProgress.create({
        ownerId,
        recipeId: RECIPE_ID,
        inventory: DEFAULT_INVENTORY,
        checklist: DEFAULT_CHECKLIST,
      });
    }

    return NextResponse.json(progress);
  } catch (error) {
    console.error("Cooking progress GET error:", error);
    return NextResponse.json(
      { error: "Failed to load cooking progress" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    await connectDB();

    const ownerId = "CURRENT_USER_ID";
    const body = await request.json();
    const { inventory, checklist } = body;

    const update: Record<string, unknown> = {};

    if (inventory !== undefined) update.inventory = inventory;
    if (checklist !== undefined) update.checklist = checklist;

    if (Object.keys(update).length === 0) {
      return NextResponse.json({ error: "Nothing to update" }, { status: 400 });
    }

    const progress = await CookingProgress.findOneAndUpdate(
      { ownerId, recipeId: RECIPE_ID },
      { $set: update },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    return NextResponse.json(progress);
  } catch (error) {
    console.error("Cooking progress PATCH error:", error);
    return NextResponse.json(
      { error: "Failed to update cooking progress" },
      { status: 500 }
    );
  }
}