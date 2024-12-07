"use server";

import prisma from "@/lib/db";
import { addAssetTypeSchema } from "@/schemas/asset-type-schema";
import { z } from "zod";

export const createAssetType = async (
  data: z.infer<typeof addAssetTypeSchema>
) => {
  const value = addAssetTypeSchema.parse(data);
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

const editAssetTypeSchema = addAssetTypeSchema.extend({
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
