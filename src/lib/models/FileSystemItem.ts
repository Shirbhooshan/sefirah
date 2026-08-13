import mongoose, {
  Schema,
  models,
  model,
} from "mongoose";

const FileSystemItemSchema = new Schema(
  {
    // The user who owns this file/folder
    ownerId: {
      type: String,
      required: true,
      index: true,
    },

    // File or folder name
    name: {
      type: String,
      required: true,
      trim: true,
    },

    // What kind of filesystem item this is
    type: {
      type: String,
      required: true,
      enum: ["file", "folder"],
    },

    // Parent folder.
    // null means this item is at the root.
    parentId: {
      type: String,
      default: null,
      index: true,
    },

    // Only used by files for now.
    // Folders will simply keep this empty.
    content: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

const FileSystemItem =
  models.FileSystemItem ||
  model(
    "FileSystemItem",
    FileSystemItemSchema
  );

export default FileSystemItem;