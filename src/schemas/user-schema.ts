import { Role } from "@prisma/client";
import { z } from "zod";

export const addUserSchema = z.object({
  username: z.string().min(1, "Username is required"),
  email: z.string().email("Invalid email format"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(64, "Password must be at most 64 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(
      /[^A-Za-z0-9]/,
      "Password must contain at least one special character"
    ),
  role: z.nativeEnum(Role),
});

export const editUserSchema = z.object({
  username: z.string(),
  email: z.string().email("Invalid email format"),
  id: z.number(),
  role: z.nativeEnum(Role),
});
