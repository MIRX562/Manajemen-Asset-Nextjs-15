import { z } from "zod";

export const addAssetTypeSchema = z.object({
  model: z.string(),
  manufacturer: z.string(),
  category: z.string(),
  description: z.string().nullable(),
});

export const editAssetTypeSchema = addAssetTypeSchema.extend({
  id: z.number(),
});
