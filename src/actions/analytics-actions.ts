"use server";

import prisma from "@/lib/db";
import { calculateDepreciation } from "@/lib/utils";
import { endOfMonth, startOfMonth, subYears } from "date-fns";

export async function getDashboardSummary() {
  const [
    totalAssets,
    activeAssets,
    pendingMaintenance,
    lowStockCount,
    checkoutCount,
  ] = await Promise.all([
    prisma.asset.count(),
    prisma.asset.count({ where: { status: "AKTIF" } }),
    prisma.maintenance.count({ where: { status: "DIJADWALKAN" } }),
    prisma.inventory.count({
      where: { quantity: { lte: prisma.inventory.fields.reorder_level } },
    }),
    prisma.checkInOut.count({ where: { status: "DIPINJAM" } }),
  ]);

  return {
    totalAssets,
    activeAssets,
    utilizationRate: (activeAssets / totalAssets) * 100,
    pendingMaintenance,
    lowStockCount,
    checkoutCount,
  };
}

export async function getAssetValuationOverYear() {
  // Define the range (last 12 months)
  const startDate = subYears(new Date(), 1);
  const endDate = new Date();

  // Fetch assets within the range
  const assets = await prisma.asset.findMany({
    where: {
      purchase_date: {
        gte: startOfMonth(startDate),
        lte: endOfMonth(endDate),
      },
    },
    select: {
      initial_value: true,
      salvage_value: true,
      useful_life: true,
      purchase_date: true,
    },
  });

  // Calculate valuation by month
  const valuationsByMonth = {};
  assets.forEach((asset) => {
    const purchaseDate = new Date(asset.purchase_date);
    for (
      let year = startDate.getFullYear();
      year <= endDate.getFullYear();
      year++
    ) {
      for (let month = 0; month < 12; month++) {
        const currentMonth = new Date(year, month);
        if (currentMonth < purchaseDate || currentMonth > endDate) continue;

        // Calculate years used
        const yearsUsed =
          currentMonth.getFullYear() -
          purchaseDate.getFullYear() +
          (currentMonth.getMonth() - purchaseDate.getMonth()) / 12;

        // Calculate depreciated value
        const depreciatedValue = calculateDepreciation(
          asset.initial_value,
          asset.salvage_value,
          asset.useful_life,
          yearsUsed
        );

        // Group by month string
        const monthKey = currentMonth; // Full date with day
        valuationsByMonth[monthKey] =
          (valuationsByMonth[monthKey] || 0) + depreciatedValue;
      }
    }
  });

  // Format data for line chart
  return Object.entries(valuationsByMonth).map(([month, totalValue]) => ({
    month,
    totalValue,
  }));
}

export async function getInventoryMetrics() {
  const [totalItems, lowStockAlerts, totalValue, categories] =
    await Promise.all([
      prisma.inventory.count(), // Total inventory items
      prisma.inventory.count({
        where: { quantity: { lt: prisma.inventory.fields.reorder_level } }, // Low stock alerts
      }),
      prisma.inventory.aggregate({
        _sum: { quantity: true, unit_price: true },
      }), // Total inventory value
      prisma.inventory.groupBy({
        by: ["category"],
        _count: { category: true },
      }), // Unique categories count
    ]);

  return {
    totalItems,
    lowStockAlerts,
    totalValue:
      totalValue._sum.quantity && totalValue._sum.unit_price
        ? totalValue._sum.quantity * totalValue._sum.unit_price
        : 0,
    categories: categories.length,
  };
}

export async function getRecentInventoryActivities() {
  // Step 1: Fetch activity logs related to INVENTORY
  const activities = await prisma.activityLog.findMany({
    where: { target_type: "INVENTORY" },
    orderBy: { timestamp: "desc" },
    take: 10, // Limit to recent 10 activities
    select: {
      id: true,
      action: true,
      target_id: true,
      timestamp: true,
    },
  });

  // Step 2: Extract unique inventory IDs to reduce DB calls
  const inventoryIds = [
    ...new Set(activities.map((activity) => activity.target_id)),
  ];

  // Step 3: Fetch inventory names in a single query
  const inventories = await prisma.inventory.findMany({
    where: { id: { in: inventoryIds } },
    select: { id: true, name: true },
  });

  // Step 4: Map inventory names to activity logs
  const inventoryMap = Object.fromEntries(
    inventories.map((inv) => [inv.id, inv.name])
  );

  return activities.map((activity) => ({
    id: activity.id,
    item: inventoryMap[activity.target_id] || "Unknown Item",
    action: activity.action,
    timestamp: activity.timestamp.toISOString(), // Format timestamp
  }));
}
