import mongoose, { Schema, models } from "mongoose";

const ChecklistItemSchema = new Schema(
    {
        required: {
            type: Number,
            required: true,
        },

        collected: {
            type: Number,
            default: 0,
        },
    },
    {
        _id: false,
    }
);

const CookingProgressSchema = new Schema(
    {
        ownerId: {
            type: String,
            required: true,
            index: true,
        },

        recipeId: {
            type: String,
            required: true,
        },

        inventory: {
            type: Map,
            of: Number,
            default: {},
        },

        checklist: {
            type: Map,
            of: ChecklistItemSchema,
            default: {},
        },
    },

    {
        timestamps: true,
    }
);

CookingProgressSchema.index(
    {
        ownerId: 1,
        recipeId: 1,
    },
    {
        unique: true,
    }
);

const CookingProgress =
    models.CookingProgress ||
    mongoose.model(
        "CookingProgress",
        CookingProgressSchema
    );

export default CookingProgress;