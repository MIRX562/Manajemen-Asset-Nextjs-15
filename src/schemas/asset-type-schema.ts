import { z } from "zod";

export const addAssetTypeSchema = z.object({
  model: z.string(),
  manufacturer: z.string(),
  category: z.string(),
  description: z.string().nullable(),
  created_at: z.date(),
  updated_at: z.date(),
});

export const editAssetTypeSchema = addAssetTypeSchema.extend({
  id: z.number(),
});
