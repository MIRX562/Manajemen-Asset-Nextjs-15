"use server";

import prisma from "@/lib/db";
import { z } from "zod";
import { createActivityLog } from "./activities-actions";
import { Inventory } from "@prisma/client";

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
    const item = await prisma.inventory.create({ data });
    createActivityLog({
      action: `Add new inventory: ${item.name}`,
      target_type: "INVENTORY",
      target_id: item.id,
    });
  } catch (error) {
    console.error(
      "[createInventoryItem] Failed to create inventory item:",
      error
    );
    throw new Error("Failed to create inventory item. Please try again.");
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
    const updatedItem = await prisma.inventory.update({
      where: { id: data.id },
      data,
    });
    createActivityLog({
      action: `Updated inventory: ${updatedItem.name}`,
      target_type: "INVENTORY",
      target_id: updatedItem.id,
    });
  } catch (error) {
    console.error(
      `[updateInventoryItem] Failed to update inventory item with ID ${data.id}:`,
      error
    );
    throw new Error("Failed to update the inventory item. Please try again.");
  }
}

const itemSchema = z.object({
  item_ID: z.number(),
  quantity: z.number().min(1, "Quantity must be at least 1"),
});

const restockSchema = z.object({
  items: z.array(itemSchema),
});

export async function restockItem(data: z.infer<typeof restockSchema>) {
  try {
    const parsedData = restockSchema.parse(data);

    await prisma.$transaction(
      parsedData.items.map(({ item_ID, quantity }) =>
        prisma.inventory.update({
          where: { id: item_ID },
          data: { quantity: { increment: quantity } },
        })
      )
    );
    for (const { item_ID, quantity } of parsedData.items) {
      await createActivityLog({
        action: `Restocked ${quantity} units`,
        target_type: "INVENTORY",
        target_id: item_ID,
      });
    }

    return { success: true, message: "Items restocked successfully" };
  } catch (error) {
    console.error("Restock error:", error);
    throw new Error("Failed to restock items");
  }
}

const consumeSchema = z.object({
  items: z.array(itemSchema),
});

export async function consumeItem(data: z.infer<typeof consumeSchema>) {
  try {
    const parsedData = consumeSchema.parse(data);

    const items = await prisma.inventory.findMany({
      where: { id: { in: parsedData.items.map((item) => item.item_ID) } },
      select: { id: true, quantity: true },
    });

    const insufficientStock = parsedData.items
      .map((item) => {
        const dbItem = items.find((db) => db.id === item.item_ID);
        if (!dbItem || dbItem.quantity < item.quantity) {
          return `- Item ID:${dbItem?.id ?? "Unknown Item"} (Requested: ${
            item.quantity
          }, Available: ${dbItem?.quantity ?? 0})`;
        }
        return null;
      })
      .filter(Boolean); // Remove null values

    if (insufficientStock.length > 0) {
      throw new Error(
        `Insufficient stock for:\n${insufficientStock.join("\n")}`
      );
    }

    await prisma.$transaction(
      parsedData.items.map(({ item_ID, quantity }) =>
        prisma.inventory.update({
          where: { id: item_ID },
          data: { quantity: { decrement: quantity } },
        })
      )
    );
    for (const { item_ID, quantity } of parsedData.items) {
      await createActivityLog({
        action: `Consumed ${quantity} units`,
        target_type: "INVENTORY",
        target_id: item_ID,
      });
    }

    return { success: true, message: "Items consumed successfully" };
  } catch (error) {
    console.error("Consume error:", error);
    throw error;
  }
}

// Delete an inventory item
export async function deleteInventoryItem(data: Inventory) {
  try {
    const deleted = await prisma.inventory.delete({
      where: { id: data.id },
    });
    createActivityLog({
      action: `Deleted inventory : ${deleted.name}`,
      target_type: "INVENTORY",
      target_id: deleted.id,
    });
  } catch (error) {
    console.error(
      `[deleteInventoryItem] Failed to delete inventory item with ID ${data.id}:`,
      error
    );
    throw new Error("Failed to delete the inventory item. Please try again.");
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
      orderBy: {
        updated_at: "desc",
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
