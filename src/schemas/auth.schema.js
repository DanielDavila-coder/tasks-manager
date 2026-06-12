import { z } from "zod";

export const registerSchemas = z.object({
  username: z
    .string({
      required_error: "Username is required",
    })
    .trim()
    .min(1, {
      message: "Username is required",
    }),

  email: z
    .string({
      required_error: "Email is required",
    })
    .trim()
    .min(1, {
      message: "Email is required",
    })
    .email({
      message: "Invalid email",
    }),

  password: z
    .string({
      required_error: "Password is required",
    })
    .min(1, {
      message: "Password is required",
    })
    .min(8, {
      message: "Password must be at least 8 characters long",
    }),
});

export const loginSchemas = z.object({
  email: z
    .string({
      required_error: "Email is required",
    })
    .trim()
    .min(1, {
      message: "Email is required",
    })
    .email({
      message: "Invalid email",
    }),

  password: z
    .string({
      required_error: "Password is required",
    })
    .min(1, {
      message: "Password is required",
    })
    .min(8, {
      message: "Password must be at least 8 characters long",
    }),
});

export const updateUsernameSchema = z.object({
  username: z
    .string({
      required_error: "Username is required",
    })
    .trim()
    .min(1, {
      message: "Username is required",
    }),
});

export const updateEmailSchema = z.object({
  email: z
    .string({
      required_error: "Email is required",
    })
    .trim()
    .min(1, {
      message: "Email is required",
    })
    .email({
      message: "Invalid email",
    }),
});

export const updatePasswordSchema = z.object({
  currentPassword: z
    .string({
      required_error: "Current password is required",
    })
    .min(1, {
      message: "Current password is required",
    }),
  newPassword: z
    .string({
      required_error: "New password is required",
    })
    .min(1, {
      message: "New password is required",
    })
    .min(8, {
      message: "New password must be at least 8 characters",
    }),
});
