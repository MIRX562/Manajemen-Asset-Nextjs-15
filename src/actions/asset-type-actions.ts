"use server";

import prisma from "@/lib/db";
import { addAssetTypeSchema } from "@/schemas/asset-type-schema";
import { z } from "zod";
import { createActivityLog } from "./activities-actions";

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
    createActivityLog({
      action: `Add new type: ${assetType.model}`,
      target_type: "ASSET_TYPE",
      target_id: assetType.id,
    });
    return assetType;
  } catch (error) {
    console.error(error);
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
    createActivityLog({
      action: `updated type: ${assetType.model}`,
      target_type: "ASSET_TYPE",
      target_id: assetType.id,
    });
    return assetType;
  } catch (error) {
    console.error(error);
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
    createActivityLog({
      action: `Deleted type: ${data.id}`,
      target_type: "ASSET_TYPE",
      target_id: data.id,
    });
  } catch (error) {
    console.error(error);
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
      orderBy: { id: "desc" },
    });
    return assetTypes;
  } catch (error) {
    throw new Error("Failed to fetch asset types");
  }
};
