import { LocationType } from "@prisma/client";
import { z } from "zod";

export const createLocationSchema = z.object({
  name: z.string(),
  type: z.nativeEnum(LocationType),
  address: z.string(),
});

export const editLocationSchema = createLocationSchema.extend({
  id: z.number(),
});
