import {
  AssetStatus,
  CheckInOutStatus,
  LifecycleStage,
  MaintenanceStatus,
} from "@prisma/client";
import { z } from "zod";

export const createAssetSchema = z.object({
  name: z.string(),
  type_id: z.coerce.number(),
  status: z.nativeEnum(AssetStatus),
  purchase_date: z.date(),
  lifecycle_stage: z.nativeEnum(LifecycleStage),
  initial_value: z.coerce.number().min(0, "Initial value must be a number"),
  salvage_value: z.coerce.number().min(0, "Salvage value must be a number"),
  useful_life: z.coerce.number().min(0, "Useful life must be a number"),
  location_id: z.coerce.number(),
  lifecycle_notes: z.string().optional(),
});

export const editAssetSchema = createAssetSchema.extend({
  id: z.number(), // Add id for editing an asset
});

export const deleteAssetSchema = z.object({
  id: z.number(),
});

export const getAssetSchema = z.object({
  id: z.number(),
});

export interface AssetDetail {
  id: number;
  name: string;
  type_id: number;
  status: "AKTIF" | "TIDAK_AKTIF" | "RUSAK";
  purchase_date: Date;
  initial_value: number;
  salvage_value: number;
  useful_life: number;
  created_at: Date;
  updated_at: Date;
  type: { model: string };
  locationHistory: LocationHistory[];
  maintenances: Maintenance[];
  checkInOuts: CheckInOut[];
  assetLifecycles: AssetLifecycle[];
}

interface LocationHistory {
  id: number;
  assigned_date: Date;
  release_date?: Date;
  location: {
    id: number;
    name: string;
  };
}

interface Maintenance {
  id: number;
  status: MaintenanceStatus;
  scheduled_date: Date;
}

interface CheckInOut {
  id: number;
  updated_at: Date;
  status: CheckInOutStatus;
  user: {
    username: string;
  };
  employee: {
    name: string;
  };
}

interface AssetLifecycle {
  id: number;
  stage: LifecycleStage;
  change_date: Date;
  notes?: string;
}
