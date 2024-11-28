"use server";
import prisma from "@/lib/db";

// Get upcoming maintenance tasks
export async function getUpcomingMaintenance() {
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

// Create a new maintenance record
export async function createMaintenance(data: {
  asset_id: number;
  mechanic_id: number;
  scheduled_date: Date;
  status: "DIJADWALKAN" | "SELESAI" | "TERTUNDA";
  notes?: string;
}) {
  try {
    return await prisma.maintenance.create({ data });
  } catch (error) {
    console.error(
      "[createMaintenance] Failed to create maintenance record:",
      error
    );
    throw new Error("Unable to create maintenance record. Please try again.");
  }
}

// Get all maintenance records
export async function getAllMaintenances() {
  try {
    return await prisma.maintenance.findMany({
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
      "[getAllMaintenances] Failed to fetch maintenance records:",
      error
    );
    throw new Error("Unable to fetch maintenance records. Please try again.");
  }
}

// Get maintenance record by ID
export async function getMaintenanceById(id: number) {
  try {
    const maintenance = await prisma.maintenance.findUnique({
      where: { id },
      include: {
        asset: true,
        mechanic: true,
        inventoryItems: { include: { inventory: true } },
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

// Get maintenance records by asset ID
export async function getMaintenancesByAssetId(asset_id: number) {
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

// Get maintenance records by mechanic ID
export async function getMaintenancesByMechanicId(mechanic_id: number) {
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

// Update a maintenance record
export async function updateMaintenance(
  id: number,
  data: {
    asset_id?: number;
    mechanic_id?: number;
    scheduled_date?: Date;
    status?: "DIJADWALKAN" | "SELESAI" | "TERTUNDA";
    notes?: string;
  }
) {
  try {
    return await prisma.maintenance.update({
      where: { id },
      data,
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

// Delete a maintenance record
export async function deleteMaintenance(id: number) {
  try {
    return await prisma.maintenance.delete({
      where: { id },
    });
  } catch (error) {
    console.error(
      `[deleteMaintenance] Failed to delete maintenance record with ID ${id}:`,
      error
    );
    throw new Error(
      "Unable to delete the maintenance record. Please try again."
    );
  }
}

// Get upcoming scheduled maintenances
export async function getUpcomingMaintenances() {
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

// Get completed maintenance count
export async function getCompletedMaintenanceCount() {
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

// Get pending maintenance count
export async function getPendingMaintenanceCount() {
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

// Get delayed maintenance records
export async function getDelayedMaintenances() {
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
