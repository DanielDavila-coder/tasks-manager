import mongoose from "mongoose";
import { MONGODB_URI } from "./config.js";

export const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log(">>>DB is connected");
  } catch (error) {
    console.error("Database connection failed:", error.message);
    throw error;
  }
};
