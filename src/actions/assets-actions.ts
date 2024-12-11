"use server";

import prisma from "@/lib/db";
import {
  createAssetSchema,
  deleteAssetSchema,
  editAssetSchema,
  getAssetSchema,
} from "@/schemas/asset-schema";
import { z } from "zod";

export const createAsset = async (data: z.infer<typeof createAssetSchema>) => {
  const value = createAssetSchema.parse(data);
  try {
    const asset = await prisma.asset.create({
      data: {
        ...value,
      },
    });
    return asset;
  } catch (error) {
    throw new Error("Failed to create asset");
  }
};

export const editAsset = async (data: z.infer<typeof editAssetSchema>) => {
  const value = editAssetSchema.parse(data);
  try {
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
    return asset;
  } catch (error) {
    throw new Error("Failed to update asset");
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
              status: "DIPINJAM", // Assuming 'CHECKED_OUT' represents active checkouts
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
