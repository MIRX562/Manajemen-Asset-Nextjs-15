import { Role } from "@prisma/client";
import { z } from "zod";

export const addUserSchema = z.object({
  username: z.string().min(0),
  email: z.string(),
  password: z.string().min(8),
  role: z.nativeEnum(Role),
});

export const editUserSchema = z.object({
  username: z.string(),
  email: z.string().email("Invalid email format"),
  id: z.number(),
  role: z.nativeEnum(Role),
});
