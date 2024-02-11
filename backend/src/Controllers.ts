import { RequestHandler } from "express";
import { File, User } from "./models";

export const createUserController: RequestHandler = async (req, res) => {
  try {
    const { username } = req.body;
    if (!username)
      return res.status(400).json({ message: "Username is required" });

    const userExists = await User.findOne({ username }).populate("files");

    if (userExists)
      return res
        .status(200)
        .json({ message: "User already exists", user: userExists });
    const user = await User.create({ username });

    return res.status(201).json({ message: "User created", user });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const joinUserController: RequestHandler = async (req, res) => {
  try {
    const { username } = req.body;
    if (!username)
      return res.status(400).json({ message: "Username is required" });

    const user = await User.findOne({
      username,
    });

    return res.status(200).json({ message: "User found", user });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const createFileController: RequestHandler = async (req, res) => {
  try {
    const { filename, content, username } = req.body;
    if (!filename || !content || !username)
      return res
        .status(400)
        .json({ message: "Filename and content  are required" });

    const user = await User.findOne({ username });

    if (!user) return res.status(404).json({ message: "User not found" });

    const file = await File.create({ filename, content, user });

    user.files.push(file._id);
    await user.save();

    return res.status(201).json({ message: "File created", file });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const giveAccessController: RequestHandler = async (req, res) => {
  try {
    const { fileId, owner, username } = req.body;
    if (!fileId || !owner || !username)
      return res
        .status(400)
        .json({ message: "FileId, owner and username are required" });

    const ownerUser = await User.findOne({
      username: owner,
    });
    if (!ownerUser) return res.status(404).json({ message: "Owner not found" });

    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ message: "User not found" });

    const file = await File.findOne({ _id: fileId, user: ownerUser });
    if (!file) return res.status(404).json({ message: "File not found" });

    file.users.push(user._id);
    await file.save();

    user.access.push(file._id);
    await user.save();

    return res.status(200).json({ message: "Access given", file });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const removeAccessController: RequestHandler = async (req, res) => {
  try {
    const { fileId, owner, username } = req.body;
    if (!fileId || !owner || !username)
      return res
        .status(400)
        .json({ message: "FileId, owner and username are required" });

    const ownerUser = await User.findOne({
      username: owner,
    });
    if (!ownerUser) return res.status(404).json({ message: "Owner not found" });

    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ message: "User not found" });

    const file = await File.findOne({ _id: fileId, user: ownerUser });
    if (!file) return res.status(404).json({ message: "File not found" });

    file.users = file.users.filter((u) => u.toString() !== user._id.toString());
    await file.save();

    user.access = user.access.filter(
      (f) => f.toString() !== file._id.toString()
    );
    await user.save();

    return res.status(200).json({ message: "Access removed", file });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const listFilesController: RequestHandler = async (req, res) => {
  try {
    const { username } = req.body;

    if (!username)
      return res.status(400).json({ message: "Username is required" });

    const user = await User.findOne({
      username,
    });

    if (!user) return res.status(404).json({ message: "User not found" });

    const files = await File.find({}).select({ filename: 1, createdAt: 1 });

    return res.status(200).json({ message: "Files found", files });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const listCreatedFilesController: RequestHandler = async (req, res) => {
  try {
    const { username } = req.body;

    if (!username)
      return res.status(400).json({ message: "Username is required" });

    const user = await User.findOne({
      username,
    }).populate("files");

    if (!user) return res.status(404).json({ message: "User not found" });

    return res.status(200).json({ message: "Files found", files: user.files });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const listAccessedFilesController: RequestHandler = async (req, res) => {
  try {
    const { username } = req.body;

    if (!username)
      return res.status(400).json({ message: "Username is required" });

    const user = await User.findOne({
      username,
    }).populate([
      {
        path: "access",
        select: { filename: 1, content: 1, createdAt: 1 },
      },
    ]);

    if (!user) return res.status(404).json({ message: "User not found" });

    return res.status(200).json({ message: "Files found", files: user.access });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
