"use server";

import prisma from "@/lib/db";
import { scheduleMaintenanceSchema } from "@/schemas/maintenance-schema";
import { LifecycleStage } from "@prisma/client";
import { z } from "zod";
import { createActivityLog } from "./activities-actions";
import { getCurrentSession } from "@/lib/auth";

export async function scheduleMaintenance(
  data: z.infer<typeof scheduleMaintenanceSchema>
) {
  const { user } = await getCurrentSession();
  if (!user) throw new Error("Not Authorized");
  try {
    const validatedData = scheduleMaintenanceSchema.parse(data);

    return await prisma.$transaction(async (tx) => {
      const maintenance = await tx.maintenance.create({
        data: {
          asset_id: validatedData.asset_id,
          mechanic_id: validatedData.mechanic_id,
          scheduled_date: validatedData.scheduled_date,
          status: validatedData.status,
          notes: validatedData.notes,
        },
      });

      if (validatedData.inventory && validatedData.inventory.length > 0) {
        const inventoryRecords = validatedData.inventory.map((item) => ({
          maintenance_id: maintenance.id,
          inventory_id: item.item_id,
          quantity_used: item.quantity,
        }));

        await tx.maintenanceInventory.createMany({
          data: inventoryRecords,
        });
      }

      await tx.assetLifecycle.create({
        data: {
          asset_id: validatedData.asset_id,
          stage: LifecycleStage.PERBAIKAN,
          change_date: new Date(),
          notes: validatedData.notes,
        },
      });
      createActivityLog({
        action: `Maintenance scheduled : ${maintenance.id}`,
        target_type: "MAINTENANCE",
        target_id: maintenance.id,
      });
      return maintenance;
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error("[Validation Error]:", error.errors);
      throw new Error("Invalid input data. Please check your form fields.");
    }

    console.error(
      "[createMaintenanceWithInventory] Failed to create maintenance and inventory records:",
      error
    );
    throw new Error(
      "Unable to create maintenance and inventory records. Please try again."
    );
  }
}

export async function getAllMaintenanceInventories() {
  const { user } = await getCurrentSession();
  if (!user) throw new Error("Not Authorized");
  try {
    return await prisma.maintenanceInventory.findMany({
      include: {
        maintenance: {
          include: {
            asset: true,
            mechanic: true,
          },
        },
        inventory: true,
      },
    });
  } catch (error) {
    console.error(
      "[getAllMaintenanceInventories] Failed to fetch MaintenanceInventory records:",
      error
    );
    throw new Error(
      "Unable to fetch MaintenanceInventory records. Please try again."
    );
  }
}

export async function getMaintenanceInventoryById(
  maintenance_inventory_id: number
) {
  const { user } = await getCurrentSession();
  if (!user) throw new Error("Not Authorized");
  try {
    const record = await prisma.maintenanceInventory.findUnique({
      where: { maintenance_inventory_id },
      include: {
        maintenance: {
          include: {
            asset: true,
            mechanic: true,
          },
        },
        inventory: true,
      },
    });
    if (!record) {
      throw new Error(
        `MaintenanceInventory record with ID ${maintenance_inventory_id} not found.`
      );
    }
    return record;
  } catch (error) {
    console.error(
      `[getMaintenanceInventoryById] Failed to fetch MaintenanceInventory record with ID ${maintenance_inventory_id}:`,
      error
    );
    throw new Error(
      "Unable to fetch the specified MaintenanceInventory record. Please try again."
    );
  }
}

export async function getMaintenanceInventoriesByMaintenanceId(
  maintenance_id: number
) {
  const { user } = await getCurrentSession();
  if (!user) throw new Error("Not Authorized");
  try {
    return await prisma.maintenanceInventory.findMany({
      where: { maintenance_id },
      include: {
        maintenance: {
          include: {
            asset: true,
            mechanic: true,
          },
        },
        inventory: true,
      },
    });
  } catch (error) {
    console.error(
      `[getMaintenanceInventoriesByMaintenanceId] Failed to fetch MaintenanceInventory records for Maintenance ID ${maintenance_id}:`,
      error
    );
    throw new Error(
      "Unable to fetch MaintenanceInventory records for the specified Maintenance ID. Please try again."
    );
  }
}

export async function getMaintenanceInventoriesByInventoryId(
  inventory_id: number
) {
  const { user } = await getCurrentSession();
  if (!user) throw new Error("Not Authorized");
  try {
    return await prisma.maintenanceInventory.findMany({
      where: { inventory_id },
      include: {
        maintenance: {
          include: {
            asset: true,
            mechanic: true,
          },
        },
        inventory: true,
      },
    });
  } catch (error) {
    console.error(
      `[getMaintenanceInventoriesByInventoryId] Failed to fetch MaintenanceInventory records for Inventory ID ${inventory_id}:`,
      error
    );
    throw new Error(
      "Unable to fetch MaintenanceInventory records for the specified Inventory ID. Please try again."
    );
  }
}

export async function updateMaintenanceInventory(
  maintenance_inventory_id: number,
  data: {
    maintenance_id?: number;
    inventory_id?: number;
    quantity_used?: number;
  }
) {
  const { user } = await getCurrentSession();
  if (!user) throw new Error("Not Authorized");
  try {
    return await prisma.maintenanceInventory.update({
      where: { maintenance_inventory_id },
      data,
    });
  } catch (error) {
    console.error(
      `[updateMaintenanceInventory] Failed to update MaintenanceInventory record with ID ${maintenance_inventory_id}:`,
      error
    );
    throw new Error(
      "Unable to update the MaintenanceInventory record. Please try again."
    );
  }
}

export async function deleteMaintenanceInventory(
  maintenance_inventory_id: number
) {
  const { user } = await getCurrentSession();
  if (!user) throw new Error("Not Authorized");
  try {
    return await prisma.maintenanceInventory.delete({
      where: { maintenance_inventory_id },
    });
  } catch (error) {
    console.error(
      `[deleteMaintenanceInventory] Failed to delete MaintenanceInventory record with ID ${maintenance_inventory_id}:`,
      error
    );
    throw new Error(
      "Unable to delete the MaintenanceInventory record. Please try again."
    );
  }
}

export async function getTotalInventoryUsageByMaintenance(
  maintenance_id: number
) {
  const { user } = await getCurrentSession();
  if (!user) throw new Error("Not Authorized");
  try {
    const result = await prisma.maintenanceInventory.aggregate({
      where: { maintenance_id },
      _sum: { quantity_used: true },
    });
    return result._sum.quantity_used || 0;
  } catch (error) {
    console.error(
      `[getTotalInventoryUsageByMaintenance] Failed to calculate total inventory usage for Maintenance ID ${maintenance_id}:`,
      error
    );
    throw new Error(
      "Unable to calculate total inventory usage for the specified maintenance. Please try again."
    );
  }
}

export async function getTotalUsageByInventory(inventory_id: number) {
  const { user } = await getCurrentSession();
  if (!user) throw new Error("Not Authorized");
  try {
    const result = await prisma.maintenanceInventory.aggregate({
      where: { inventory_id },
      _sum: { quantity_used: true },
    });
    return result._sum.quantity_used || 0;
  } catch (error) {
    console.error(
      `[getTotalUsageByInventory] Failed to calculate total inventory usage for Inventory ID ${inventory_id}:`,
      error
    );
    throw new Error(
      "Unable to calculate total inventory usage for the specified inventory. Please try again."
    );
  }
}

export async function getInventoryMaintenanceUsage(inventory_id: number) {
  const { user } = await getCurrentSession();
  if (!user) throw new Error("Not Authorized");
  try {
    const data = await prisma.maintenanceInventory.findMany({
      where: {
        inventory_id,
      },
      select: {
        maintenance: {
          select: {
            status: true,
          },
        },
        quantity_used: true,
        maintenance_id: true,
        updated_at: true,
      },
    });
    return data;
  } catch (error) {
    console.error(error);
    throw new Error("Unable to fetch inventory maintenance usage!");
  }
}
