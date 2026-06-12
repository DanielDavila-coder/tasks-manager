import { z } from "zod";
import {
  TASK_AREAS,
  TASK_PRIORITIES,
  TASK_STATUSES,
} from "../constants/task.constants.js";

export const createTaskSchema = z.object({
  priority: z.enum(TASK_PRIORITIES).optional(),
  area: z.enum(TASK_AREAS).optional(),
  title: z
    .string({
      required_error: "Title is required",
    })
    .trim()
    .min(1, {
      message: "Title is required",
    }),

  description: z
    .string({
      required_error: "Description is required",
    })
    .trim()
    .min(1, {
      message: "Description is required",
    }),

  status: z.enum(TASK_STATUSES).optional(),

  dueDate: z
    .union([
      z.string().datetime({
        message: "Invalid due date",
      }),
      z.null(),
    ])
    .optional(),
});

export const updateTaskSchema = createTaskSchema.partial().refine(
  (data) => Object.keys(data).length > 0,
  {
    message: "At least one field is required to update the task",
  },
);
