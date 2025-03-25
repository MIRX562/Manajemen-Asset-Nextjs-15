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
  notes: z.string().nullable(),
  id: z.coerce.number(),
  asset_id: z.coerce.number(),
});

export const editAssetMechanicSchema = z.object({
  id: z.number().min(1, "Asset is required"),
  asset_id: z.number().min(1, "Asset is required"),
  mechanic_id: z.number().min(1, "Mechanic is required"),
});

export const editInventorySchema = z.object({
  id: z.number().min(1, "Asset is required"),
  inventory: z
    .array(
      z.object({
        inventory_id: z.coerce.number().min(1, "Item is required"),
        quantity_used: z.coerce.number().min(1, "Quantity must be at least 1"),
      })
    )
    .nonempty("At least one inventory item is required"),
});
