import { z } from "zod";

export const createInventorySchema = z.object({
  name: z.string(),
  category: z.string(),
  quantity: z.coerce.number().min(0),
  reorder_level: z.coerce.number().min(0),
  unit_price: z.coerce.number().min(0),
  location_id: z.coerce.number(),
});

export const updateInventorySchema = createInventorySchema.extend({
  id: z.number(),
});
