import { z } from "zod";

export const createInventorySchema = z.object({
  name: z.string(),
  category: z.string(),
  quantity: z.number().min(0),
  reorder_level: z.number().min(0),
  unit_price: z.number().min(0),
  location_id: z.string(),
});

export const updateInventorySchema = createInventorySchema.extend({
  id: z.number(),
});
