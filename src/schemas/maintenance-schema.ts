import { MaintenanceStatus } from "@prisma/client";
import { z } from "zod";

export const scheduleMaintenanceSchema = z.object({
  asset_id: z.number(),
  mechanic_id: z.number(),
  scheduled_date: z.coerce.date(),
  status: z.nativeEnum(MaintenanceStatus),
  notes: z.string().optional(),
  inventory: z
    .array(
      z.object({
        item_id: z.coerce.number(),
        quantity: z.coerce
          .number()
          .positive("Quantity must be greater than zero"),
      })
    )
    .optional(),
});

export const editMaintenanceSchema = scheduleMaintenanceSchema.extend({
  id: z.number(),
});

export const updateMaintenanceStatusSchema = z.object({
  maintenance_status: z.nativeEnum(MaintenanceStatus),
  notes: z.string(),
  id: z.coerce.number(),
});
