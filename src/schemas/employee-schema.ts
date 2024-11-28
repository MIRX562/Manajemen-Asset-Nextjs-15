import { z } from "zod";

export const addEmployeeSchema = z.object({
  name: z.string(),
  department: z.string(),
  phone: z.string().min(11).max(13),
  email: z.string(),
});
export const editEmployeeSchema = z.object({
  name: z.string(),
  department: z.string(),
  phone: z.string().min(11).max(13),
  email: z.string(),
  id: z.number(),
});
