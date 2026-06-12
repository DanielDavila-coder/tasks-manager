import mongoose from "mongoose";
import {
  TASK_AREAS,
  TASK_PRIORITIES,
  TASK_STATUSES,
} from "../constants/task.constants.js";

const taskSchema = new mongoose.Schema(
  {
    priority: {
      type: String,
      enum: TASK_PRIORITIES,
      default: "medium",
    },
    area: {
      type: String,
      enum: TASK_AREAS,
      default: "personal",
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: TASK_STATUSES,
      default: "pending",
    },
    dueDate: {
      type: Date,
    },
    usuario: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("Task", taskSchema);
