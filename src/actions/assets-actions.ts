"use server";

import prisma from "@/lib/db";
import {
  createAssetSchema,
  deleteAssetSchema,
  editAssetSchema,
} from "@/schemas/asset-schema";
import { z } from "zod";

export const createAsset = async (data: z.infer<typeof createAssetSchema>) => {
  const value = createAssetSchema.parse(data);
  console.log(value);

  try {
    const asset = await prisma.asset.create({
      data: {
        name: value.name,
        type_id: value.type_id,
        status: value.status,
        purchase_date: value.purchase_date,
        initial_value: value.initial_value,
        salvage_value: value.salvage_value,
        useful_life: value.useful_life,
        lifecycle_stage: value.lifecycle_stage,
      },
    });

    // Create AssetLocationHistory
    await prisma.assetLocationHistory.create({
      data: {
        asset_id: asset.id,
        location_id: data.location_id,
        assigned_date: new Date(),
      },
    });

    // Create AssetLifecycle
    await prisma.assetLifecycle.create({
      data: {
        asset_id: asset.id,
        stage: value.lifecycle_stage,
        change_date: new Date(),
        notes:
          data.lifecycle_notes ||
          `Asset created with stage: ${value.lifecycle_stage}`,
      },
    });

    return asset;
  } catch (error) {
    console.error(`[createAsset] Error:`, error);
    throw new Error("Failed to create asset with associated records");
  }
};

export const editAsset = async (
  data: z.infer<typeof editAssetSchema>,
  locationId?: number,
  lifecycleNotes?: string
) => {
  const value = editAssetSchema.parse(data);
  console.log(value);

  try {
    // Update the asset itself
    const asset = await prisma.asset.update({
      where: { id: value.id },
      data: {
        name: value.name,
        type_id: value.type_id,
        status: value.status,
        purchase_date: value.purchase_date,
        lifecycle_stage: value.lifecycle_stage,
        initial_value: value.initial_value,
        salvage_value: value.salvage_value,
        useful_life: value.useful_life,
      },
    });

    // If locationId is provided and has changed, update the location history
    if (locationId) {
      const currentLocation = await prisma.assetLocationHistory.findFirst({
        where: {
          asset_id: asset.id,
          release_date: null, // Get the active location record
        },
      });

      // Check if the location has actually changed before updating
      if (currentLocation && currentLocation.location_id !== locationId) {
        // Update the release date for the previous location
        await prisma.assetLocationHistory.updateMany({
          where: {
            asset_id: asset.id,
            release_date: null, // Only update the active record
          },
          data: {
            release_date: new Date(),
          },
        });

        // Add a new AssetLocationHistory entry
        await prisma.assetLocationHistory.create({
          data: {
            asset_id: asset.id,
            location_id: locationId,
            assigned_date: new Date(),
          },
        });
      }
    }

    // If the lifecycle stage has changed, create a new AssetLifecycle entry
    if (value.lifecycle_stage) {
      const currentLifecycle = await prisma.assetLifecycle.findFirst({
        where: {
          asset_id: asset.id,
        },
        orderBy: {
          change_date: "desc", // Get the latest lifecycle stage
        },
      });

      // Check if the lifecycle stage or notes have changed before creating a new record
      if (
        !currentLifecycle ||
        currentLifecycle.stage !== value.lifecycle_stage ||
        lifecycleNotes !== currentLifecycle.notes
      ) {
        await prisma.assetLifecycle.create({
          data: {
            asset_id: asset.id,
            stage: value.lifecycle_stage,
            change_date: new Date(),
            notes:
              lifecycleNotes ||
              `Lifecycle stage updated to: ${value.lifecycle_stage}`,
          },
        });
      }
    }

    return asset;
  } catch (error) {
    console.error(`[editAsset] Error:`, error);
    throw new Error("Failed to update asset with associated records");
  }
};

export const deleteAsset = async (data: z.infer<typeof deleteAssetSchema>) => {
  const value = deleteAssetSchema.parse(data);
  try {
    await prisma.asset.delete({
      where: { id: value.id },
    });
  } catch (error) {
    throw new Error("Failed to delete asset");
  }
};

export const getAllAssets = async () => {
  try {
    const assets = await prisma.asset.findMany({
      include: {
        type: true,
        locationHistory: true,
        maintenances: true,
        checkInOuts: true,
        assetLifecycles: true,
      },
    });
    return assets;
  } catch (error) {
    throw new Error("Failed to fetch assets");
  }
};

export const getAssetById = async (id: number) => {
  try {
    const asset = await prisma.asset.findUnique({
      where: { id },
      include: {
        type: true,
        locationHistory: {
          include: {
            location: true,
          },
        },
        maintenances: true,
        checkInOuts: {
          include: {
            user: true,
          },
        },
        assetLifecycles: true,
      },
    });
    return asset;
  } catch (error) {
    throw new Error("Failed to fetch asset");
  }
};

export const getAssetByType = async (type_id: number) => {
  try {
    const asset = await prisma.asset.findMany({
      where: { type_id },
      include: {
        type: true,
        locationHistory: {
          include: {
            location: true,
          },
        },
        maintenances: true,
        checkInOuts: {
          include: {
            user: true,
          },
        },
        assetLifecycles: true,
      },
    });
    return asset;
  } catch (error) {
    throw new Error("Failed to fetch asset");
  }
};
export const getAvailableAssets = async () => {
  try {
    const availableAssets = await prisma.asset.findMany({
      where: {
        status: "AKTIF",
        NOT: {
          checkInOuts: {
            some: {
              actual_return_date: null,
              status: "DIPINJAM",
            },
          },
        },
      },
      select: {
        id: true,
        name: true,
      },
    });

    return availableAssets;
  } catch (error) {
    throw new Error("Failed to fetch asset");
  }
};

export async function getAssetData() {
  const checkedOutAssets = await prisma.checkInOut.count({
    where: {
      status: "DIPINJAM", // Adjust this value based on your `AssetStatus` enum
    },
  });
  const returnedAssets = await prisma.checkInOut.count({
    where: {
      status: "DIKEMBALIKAN", // Adjust this value based on your `AssetStatus` enum
    },
  });

  return [
    {
      name: "Checked-Out",
      total: checkedOutAssets,
    },
    {
      name: "Returned",
      total: returnedAssets,
    },
  ];
}
