import mongoose, { Schema, Document, Model } from "mongoose";

export interface IChecklistItem {
  required: number;
  collected: number;
}

export interface ICookingProgress extends Document {
  ownerId: string;
  recipeId: string;
  inventory: Map<string, number>;
  checklist: Map<string, IChecklistItem>;
  createdAt: Date;
  updatedAt: Date;
}

const ChecklistItemSchema = new Schema<IChecklistItem>(
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

const CookingProgressSchema = new Schema<ICookingProgress>(
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

const CookingProgress: Model<ICookingProgress> =
  mongoose.models.CookingProgress ||
  mongoose.model<ICookingProgress>(
    "CookingProgress",
    CookingProgressSchema
  );

export default CookingProgress;