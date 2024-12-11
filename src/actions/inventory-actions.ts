"use server";
import prisma from "@/lib/db";

// Create a new inventory item
export async function createInventoryItem(data: {
  name: string;
  category: string;
  quantity: number;
  reorder_level: number;
  unit_price: number;
  location_id: number;
}) {
  try {
    return await prisma.inventory.create({ data });
  } catch (error) {
    console.error(
      "[createInventoryItem] Failed to create inventory item:",
      error
    );
    throw new Error("Failed to create inventory item. Please try again.");
  }
}

// Get all inventory items
export async function getAllInventoryItems() {
  try {
    return await prisma.inventory.findMany({
      include: {
        location: {
          select: { name: true },
        },
      },
    });
  } catch (error) {
    console.error(
      "[getAllInventoryItems] Failed to retrieve inventory items:",
      error
    );
    throw new Error("Failed to retrieve inventory items. Please try again.");
  }
}

// Get inventory item by ID
export async function getInventoryItemById(id: number) {
  try {
    const item = await prisma.inventory.findUnique({
      where: { id },
      include: {
        location: true,
      },
    });
    if (!item) {
      throw new Error(`No inventory item found with ID: ${id}`);
    }
    return item;
  } catch (error) {
    console.error(
      `[getInventoryItemById] Failed to retrieve item with ID ${id}:`,
      error
    );
    throw new Error("Failed to retrieve the inventory item. Please try again.");
  }
}

// Get all inventory items at a specific location
export async function getInventoryItemsByLocation(location_id: number) {
  try {
    return await prisma.inventory.findMany({
      where: { location_id },
      include: {
        location: true,
      },
    });
  } catch (error) {
    console.error(
      `[getInventoryItemsByLocation] Failed to retrieve items for location ID ${location_id}:`,
      error
    );
    throw new Error(
      "Failed to retrieve inventory items for the specified location. Please try again."
    );
  }
}

export async function getAvailableInventoryItems() {
  try {
    return await prisma.inventory.findMany({
      select: {
        id: true,
        name: true,
        quantity: true,
      },
    });
  } catch (error) {
    console.error(
      `[getAvailableInventoryItems] Failed to retrieve available items:`,
      error
    );
    throw new Error(
      "Failed to retrieve inventory items for the specified location. Please try again."
    );
  }
}

// Update an inventory item
export async function updateInventoryItem(data: {
  id: number;
  name?: string;
  category?: string;
  quantity?: number;
  reorder_level?: number;
  unit_price?: number;
  location_id?: number;
}) {
  try {
    return await prisma.inventory.update({
      where: { id: data.id },
      data,
    });
  } catch (error) {
    console.error(
      `[updateInventoryItem] Failed to update inventory item with ID ${data.id}:`,
      error
    );
    throw new Error("Failed to update the inventory item. Please try again.");
  }
}

type UseInventoryInput = {
  inventoryId: number;
  quantity: number;
}[];

export const useInventory = async (items: UseInventoryInput) => {
  return await prisma.$transaction(async (tx) => {
    const results = [];

    for (const item of items) {
      // Fetch the inventory item
      const inventory = await tx.inventory.findUnique({
        where: { id: item.inventoryId },
        select: { quantity: true },
      });

      if (!inventory) {
        throw new Error(`Inventory item with ID ${item.inventoryId} not found`);
      }

      if (inventory.quantity < item.quantity) {
        throw new Error(
          `Insufficient quantity for inventory ID ${item.inventoryId}. Requested: ${item.quantity}, Available: ${inventory.quantity}`
        );
      }

      // Update the inventory quantity
      const updatedInventory = await tx.inventory.update({
        where: { id: item.inventoryId },
        data: { quantity: { decrement: item.quantity } },
      });

      results.push(updatedInventory);
    }

    return results;
  });
};

// Delete an inventory item
export async function deleteInventoryItem(id: number) {
  try {
    return await prisma.inventory.delete({
      where: { id },
    });
  } catch (error) {
    console.error(
      `[deleteInventoryItem] Failed to delete inventory item with ID ${id}:`,
      error
    );
    throw new Error("Failed to delete the inventory item. Please try again.");
  }
}

// Check low stock inventory items
export async function getLowStockInventoryItems() {
  try {
    return await prisma.inventory.findMany({
      where: {
        quantity: {
          lte: prisma.inventory.fields.reorder_level,
        },
      },
      include: {
        location: true,
      },
    });
  } catch (error) {
    console.error(
      "[getLowStockInventoryItems] Failed to retrieve low stock items:",
      error
    );
    throw new Error(
      "Failed to retrieve low stock inventory items. Please try again."
    );
  }
}

// Calculate total value of inventory
export async function getTotalInventoryValue() {
  try {
    const result = await prisma.inventory.aggregate({
      _sum: {
        unit_price: true,
      },
    });
    return result._sum.unit_price || 0;
  } catch (error) {
    console.error(
      "[getTotalInventoryValue] Failed to calculate total inventory value:",
      error
    );
    throw new Error(
      "Failed to calculate total inventory value. Please try again."
    );
  }
}

// Calculate inventory turnover rate
export async function getInventoryTurnoverRate() {
  try {
    return await prisma.maintenanceInventory.groupBy({
      by: ["inventory_id"],
      _sum: {
        quantity_used: true,
      },
      include: {
        inventory: {
          select: {
            name: true,
            quantity: true,
          },
        },
      },
    });
  } catch (error) {
    console.error(
      "[getInventoryTurnoverRate] Failed to calculate inventory turnover rate:",
      error
    );
    throw new Error(
      "Failed to calculate inventory turnover rate. Please try again."
    );
  }
}
