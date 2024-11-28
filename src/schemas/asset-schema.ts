import { z } from "zod";

export const createAssetSchema = z.object({
  name: z.string(),
  type_id: z.coerce.number(),
  status: z.enum(["AKTIF", "TIDAK_AKTIF", "RUSAK"]),
  purchase_date: z.date(),
  lifecycle_stage: z.enum(["BARU", "DIGUNAKAN", "PERBAIKAN", "DIHAPUS"]),
  initial_value: z.coerce.number().min(0, "Initial value must be a number"),
  salvage_value: z.coerce.number().min(0, "Salvage value must be a number"),
  useful_life: z.coerce.number().min(0, "Useful life must be a number"),
});

export const editAssetSchema = createAssetSchema.extend({
  id: z.number(),
});

export const deleteAssetSchema = z.object({
  id: z.number(),
});

export const getAssetSchema = z.object({
  id: z.number(),
});
