import mongoose from "mongoose";
import { User, File } from "./models";

const MONGO_URI = process.env.DB_URI as string;

const DbConnect = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to the database");
  } catch (error) {
    console.error("Error connecting to the database");
  }
};

export default DbConnect;
