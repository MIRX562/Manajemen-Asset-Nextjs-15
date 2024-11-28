"use server";

import prisma from "@/lib/db";
import { z } from "zod";

const createAssetTypeSchema = z.object({
  model: z.string(),
  manufacturer: z.string(),
  category: z.string(),
  description: z.string().optional(),
});

export const createAssetType = async (
  data: z.infer<typeof createAssetTypeSchema>
) => {
  const value = createAssetTypeSchema.parse(data);
  try {
    const assetType = await prisma.assetType.create({
      data: {
        ...value,
      },
    });
    return assetType;
  } catch (error) {
    throw new Error("Failed to create asset type");
  }
};

const editAssetTypeSchema = createAssetTypeSchema.extend({
  id: z.number(),
});

export const editAssetType = async (
  data: z.infer<typeof editAssetTypeSchema>
) => {
  const value = editAssetTypeSchema.parse(data);
  try {
    const assetType = await prisma.assetType.update({
      where: { id: value.id },
      data: {
        model: value.model,
        manufacturer: value.manufacturer,
        category: value.category,
        description: value.description,
      },
    });
    return assetType;
  } catch (error) {
    throw new Error("Failed to update asset type");
  }
};

const deleteAssetTypeSchema = z.object({
  id: z.number(),
});

export const deleteAssetType = async (
  data: z.infer<typeof deleteAssetTypeSchema>
) => {
  const value = deleteAssetTypeSchema.parse(data);
  try {
    await prisma.assetType.delete({
      where: { id: value.id },
    });
  } catch (error) {
    throw new Error("Failed to delete asset type");
  }
};

const getAssetTypeSchema = z.object({
  id: z.number(),
});

export const getAssetTypeById = async (id: number) => {
  try {
    const assetType = await prisma.assetType.findUnique({
      where: { id },
      include: {
        assets: true,
      },
    });
    return assetType;
  } catch (error) {
    throw new Error("Failed to fetch asset type");
  }
};

export const getAllAssetTypes = async () => {
  try {
    const assetTypes = await prisma.assetType.findMany({
      include: {
        assets: true,
      },
    });
    return assetTypes;
  } catch (error) {
    throw new Error("Failed to fetch asset types");
  }
};
