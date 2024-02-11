import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  files: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "File",
    default: [],
  },
  access: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "File",
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const FileSchema = new mongoose.Schema({
  filename: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  users: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      default: [],
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const User = mongoose.model("User", UserSchema);
const File = mongoose.model("File", FileSchema);

export { User, File };
