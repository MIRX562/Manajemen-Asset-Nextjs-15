"use server";

import prisma from "@/lib/db";
import {
  editAssetMechanicSchema,
  editInventorySchema,
  updateMaintenanceStatusSchema,
} from "@/schemas/maintenance-schema";
import { endOfWeek, startOfWeek } from "date-fns";
import { z } from "zod";
import { createActivityLog } from "./activities-actions";
import { getCurrentSession } from "@/lib/auth";

export async function updateAssetMechanic(
  data: z.infer<typeof editAssetMechanicSchema>
) {
  const { user } = await getCurrentSession();
  if (!user) throw new Error("Not Authorized");
  try {
    await prisma.maintenance.update({
      where: {
        id: data.id,
      },
      data: {
        asset_id: data.asset_id,
        mechanic_id: data.mechanic_id,
      },
    });
  } catch (error) {
    console.error(
      `[updateMaintenanceAssetMechanic] Failed to update maintenance record with ID ${data.id}:`,
      error
    );
    throw new Error(
      "Unable to update the maintenance record. Please try again."
    );
  }
}
export async function updateInventory(
  data: z.infer<typeof editInventorySchema>
) {
  const { user } = await getCurrentSession();
  if (!user) throw new Error("Not Authorized");
  try {
    const validatedData = editInventorySchema.parse(data);

    const { id, inventory } = validatedData;

    await prisma.maintenanceInventory.deleteMany({
      where: { maintenance_id: id },
    });

    await prisma.maintenanceInventory.createMany({
      data: inventory.map((item) => ({
        maintenance_id: id,
        inventory_id: item.inventory_id,
        quantity_used: item.quantity_used,
      })),
    });

    return { success: true };
  } catch (error) {
    console.error(
      `[updateInventory] Failed to update inventory for maintenance ID ${data.id}:`,
      error
    );
    throw new Error("Unable to update inventory. Please try again.");
  }
}

export async function updateMaintenanceStatus(
  data: z.infer<typeof updateMaintenanceStatusSchema>
) {
  const { user } = await getCurrentSession();
  if (!user) throw new Error("Not Authorized");
  const { id, maintenance_status, notes, asset_id } = data;
  try {
    if (maintenance_status == "SELESAI") {
      await prisma.assetLifecycle.create({
        data: {
          stage: "DIGUNAKAN",
          change_date: new Date(),
          asset_id: asset_id,
          notes: "Selesai di perbaiki",
        },
      });

      await prisma.$transaction(async (tx) => {
        await tx.maintenance.update({
          where: { id },
          data: {
            notes,
            status: maintenance_status,
          },
        });

        const inventoryItems = await tx.maintenanceInventory.findMany({
          where: {
            maintenance_id: id,
          },
          select: {
            inventory_id: true,
            quantity_used: true,
          },
        });

        await Promise.all(
          inventoryItems.map((item) =>
            tx.inventory.update({
              where: { id: item.inventory_id },
              data: { quantity: { decrement: item.quantity_used } },
            })
          )
        );
      });
    }

    await prisma.maintenance.update({
      where: { id },
      data: {
        notes,
        status: maintenance_status,
      },
    });

    createActivityLog({
      action: `Maintenance ${
        maintenance_status == "SELESAI" ? "done" : "updated"
      } : ${id}`,
      target_type: "MAINTENANCE",
      target_id: id,
    });
  } catch (error) {
    console.error(
      `[updateMaintenance] Failed to update maintenance record with ID ${id}:`,
      error
    );
    throw new Error(
      "Unable to update the maintenance record. Please try again."
    );
  }
}

export async function deleteMaintenance(data: any) {
  const { user } = await getCurrentSession();
  if (!user) throw new Error("Not Authorized");
  try {
    await prisma.maintenance.delete({
      where: { id: data.id },
    });
    createActivityLog({
      action: `Maintenance done : ${data.id}`,
      target_type: "MAINTENANCE",
      target_id: data.id,
    });
  } catch (error) {
    console.error(
      `[deleteMaintenance] Failed to delete maintenance record with ID ${data.id}:`,
      error
    );
    throw new Error(
      "Unable to delete the maintenance record. Please try again."
    );
  }
}

export async function getUpcomingMaintenance() {
  const { user } = await getCurrentSession();
  if (!user) throw new Error("Not Authorized");
  try {
    const maintenances = await prisma.maintenance.findMany({
      where: {
        scheduled_date: {
          gte: new Date(),
        },
      },
      include: {
        asset: { select: { name: true } },
        mechanic: { select: { username: true } },
      },
      orderBy: {
        scheduled_date: "asc",
      },
      take: 5,
    });

    return maintenances.map((maintenance) => ({
      id: maintenance.id,
      asset: maintenance.asset.name,
      date: maintenance.scheduled_date.toISOString().split("T")[0],
      assignee: maintenance.mechanic?.username || "Unknown",
    }));
  } catch (error) {
    console.error(
      "[getUpcomingMaintenance] Failed to fetch upcoming maintenance tasks:",
      error
    );
    throw new Error(
      "Unable to fetch upcoming maintenance tasks. Please try again."
    );
  }
}

export async function getAllMaintenances() {
  const { user } = await getCurrentSession();
  if (!user) throw new Error("Not Authorized");
  try {
    return await prisma.maintenance.findMany({
      include: {
        asset: true,
        mechanic: true,
        inventoryItems: {
          include: { inventory: true },
        },
      },
      orderBy: {
        scheduled_date: "desc",
      },
    });
  } catch (error) {
    console.error(
      "[getAllMaintenances] Failed to fetch maintenance records:",
      error
    );
    throw new Error("Unable to fetch maintenance records. Please try again.");
  }
}

export async function getMaintenanceById(id: number) {
  const { user } = await getCurrentSession();
  if (!user) throw new Error("Not Authorized");
  try {
    const maintenance = await prisma.maintenance.findUnique({
      where: { id },
      select: {
        id: true,
        notes: true,
        scheduled_date: true,
        status: true,
        created_at: true,
        updated_at: true,
        asset: {
          select: {
            id: true,
            name: true,
            status: true,
            type: {
              select: {
                model: true,
              },
            },
          },
        },
        mechanic: {
          select: {
            id: true,
            username: true,
            email: true,
          },
        },
        inventoryItems: {
          include: {
            inventory: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });
    if (!maintenance) {
      throw new Error(`Maintenance record with ID ${id} not found.`);
    }
    return maintenance;
  } catch (error) {
    console.error(
      `[getMaintenanceById] Failed to fetch maintenance record with ID ${id}:`,
      error
    );
    throw new Error("Unable to fetch maintenance record. Please try again.");
  }
}

export async function getMaintenancesByAssetId(asset_id: number) {
  const { user } = await getCurrentSession();
  if (!user) throw new Error("Not Authorized");
  try {
    return await prisma.maintenance.findMany({
      where: { asset_id },
      include: { asset: true, mechanic: true },
    });
  } catch (error) {
    console.error(
      `[getMaintenancesByAssetId] Failed to fetch maintenance records for asset ID ${asset_id}:`,
      error
    );
    throw new Error(
      "Unable to fetch maintenance records for the specified asset. Please try again."
    );
  }
}

export async function getMaintenancesByMechanicId(mechanic_id: number) {
  const { user } = await getCurrentSession();
  if (!user) throw new Error("Not Authorized");
  try {
    return await prisma.maintenance.findMany({
      where: { mechanic_id },
      include: { asset: true, mechanic: true },
    });
  } catch (error) {
    console.error(
      `[getMaintenancesByMechanicId] Failed to fetch maintenance records for mechanic ID ${mechanic_id}:`,
      error
    );
    throw new Error(
      "Unable to fetch maintenance records for the specified mechanic. Please try again."
    );
  }
}

export async function getUpcomingMaintenances() {
  const { user } = await getCurrentSession();
  if (!user) throw new Error("Not Authorized");
  try {
    return await prisma.maintenance.findMany({
      where: {
        scheduled_date: { gte: new Date() },
        status: "DIJADWALKAN",
      },
      include: { asset: true, mechanic: true },
    });
  } catch (error) {
    console.error(
      "[getUpcomingMaintenances] Failed to fetch upcoming scheduled maintenances:",
      error
    );
    throw new Error("Unable to fetch upcoming maintenances. Please try again.");
  }
}

export async function getCompletedMaintenanceCount() {
  const { user } = await getCurrentSession();
  if (!user) throw new Error("Not Authorized");
  try {
    return await prisma.maintenance.count({ where: { status: "SELESAI" } });
  } catch (error) {
    console.error(
      "[getCompletedMaintenanceCount] Failed to fetch completed maintenance count:",
      error
    );
    throw new Error(
      "Unable to fetch completed maintenance count. Please try again."
    );
  }
}

export async function getPendingMaintenanceCount() {
  const { user } = await getCurrentSession();
  if (!user) throw new Error("Not Authorized");
  try {
    return await prisma.maintenance.count({ where: { status: "DIJADWALKAN" } });
  } catch (error) {
    console.error(
      "[getPendingMaintenanceCount] Failed to fetch pending maintenance count:",
      error
    );
    throw new Error(
      "Unable to fetch pending maintenance count. Please try again."
    );
  }
}

export async function getDelayedMaintenances() {
  const { user } = await getCurrentSession();
  if (!user) throw new Error("Not Authorized");
  try {
    return await prisma.maintenance.findMany({
      where: {
        scheduled_date: { lt: new Date() },
        status: "DIJADWALKAN",
      },
      include: { asset: true, mechanic: true },
    });
  } catch (error) {
    console.error(
      "[getDelayedMaintenances] Failed to fetch delayed maintenance records:",
      error
    );
    throw new Error(
      "Unable to fetch delayed maintenance records. Please try again."
    );
  }
}

export async function getScheduledMaintenance() {
  const { user } = await getCurrentSession();
  if (!user) throw new Error("Not Authorized");
  try {
    return await prisma.maintenance.findMany({
      where: {
        status: "DIJADWALKAN",
      },
      include: {
        asset: true,
        mechanic: true,
        inventoryItems: {
          include: { inventory: true },
        },
      },
    });
  } catch (error) {
    console.error(
      "[getScheduledMaintenance] Failed to fetch delayed maintenance records:",
      error
    );
    throw new Error(
      "Unable to fetch delayed maintenance records. Please try again."
    );
  }
}

export async function getScheduledMaintenanceMetrics() {
  const { user } = await getCurrentSession();
  if (!user) throw new Error("Not Authorized");
  const now = new Date();
  const thisWeekStart = startOfWeek(now);
  const thisWeekEnd = endOfWeek(now);

  const [
    totalScheduledMaintenance,
    maintenanceThisWeek,
    overdueMaintenance,
    uniqueMechanics,
    uniqueAssets,
  ] = await Promise.all([
    prisma.maintenance.count({
      where: { status: "DIJADWALKAN" },
    }),

    prisma.maintenance.count({
      where: {
        status: "DIJADWALKAN",
        scheduled_date: {
          gte: thisWeekStart,
          lte: thisWeekEnd,
        },
      },
    }),

    prisma.maintenance.count({
      where: {
        status: "DIJADWALKAN",
        scheduled_date: { lt: now },
      },
    }),

    prisma.maintenance.groupBy({
      by: ["mechanic_id"],
      where: { status: "DIJADWALKAN" },
    }),

    prisma.maintenance.groupBy({
      by: ["asset_id"],
      where: { status: "DIJADWALKAN" },
    }),
  ]);

  return {
    totalScheduledMaintenance,
    maintenanceThisWeek,
    overdueMaintenance,
    uniqueMechanics: uniqueMechanics.length,
    uniqueAssets: uniqueAssets.length,
  };
}
