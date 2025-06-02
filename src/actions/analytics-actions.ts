"use server";

import { getCurrentSession } from "@/lib/auth";
import prisma from "@/lib/db";
import { eachMonthOfInterval, format, subMonths } from "date-fns";

export async function getDashboardSummary() {
  const { user } = await getCurrentSession();
  if (!user) throw new Error("Not Authorized");
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

function calculateDepreciation(
  initial: number,
  salvage: number,
  life: number,
  yearsUsed: number
) {
  if (yearsUsed >= life) return salvage;
  return initial - ((initial - salvage) / life) * yearsUsed;
}

export async function getAssetValuationOverYear() {
  const { user } = await getCurrentSession();
  if (!user) throw new Error("Not Authorized");
  const endDate = new Date();
  const startDate = subMonths(endDate, 11);
  const months = eachMonthOfInterval({ start: startDate, end: endDate });

  const assets = await prisma.asset.findMany({
    where: {
      purchase_date: { lte: endDate },
    },
    select: {
      id: true,
      initial_value: true,
      salvage_value: true,
      useful_life: true,
      purchase_date: true,
      assetLifecycles: {
        where: { stage: "DIHAPUS" },
        orderBy: { change_date: "desc" },
        take: 1,
        select: { change_date: true },
      },
    },
  });

  const valuationsByMonth: Record<string, number> = {};
  months.forEach((month) => {
    valuationsByMonth[format(month, "yyyy-MM")] = 0;
  });

  assets.forEach((asset) => {
    const purchaseDate = new Date(asset.purchase_date);
    const dihapusDate = asset.assetLifecycles.length
      ? new Date(asset.assetLifecycles[0].change_date)
      : null;

    months.forEach((month) => {
      if (month < purchaseDate || (dihapusDate && month > dihapusDate)) return;

      const yearsUsed =
        month.getFullYear() -
        purchaseDate.getFullYear() +
        (month.getMonth() - purchaseDate.getMonth()) / 12;

      const depreciatedValue = calculateDepreciation(
        asset.initial_value,
        asset.salvage_value,
        asset.useful_life,
        yearsUsed
      );

      const monthKey = format(month, "yyyy-MM");
      valuationsByMonth[monthKey] += depreciatedValue;
    });
  });

  return Object.entries(valuationsByMonth).map(([month, totalValue]) => ({
    month,
    totalValue,
  }));
}

export async function getInventoryMetrics() {
  const { user } = await getCurrentSession();
  if (!user) throw new Error("Not Authorized");
  const [totalItems, lowStockAlerts, totalValue, categories] =
    await Promise.all([
      prisma.inventory.count(),
      prisma.inventory.count({
        where: { quantity: { lt: prisma.inventory.fields.reorder_level } },
      }),
      prisma.inventory.aggregate({
        _sum: { quantity: true, unit_price: true },
      }),
      prisma.inventory.groupBy({
        by: ["category"],
        _count: { category: true },
      }),
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
  const { user } = await getCurrentSession();
  if (!user) throw new Error("Not Authorized");

  const activities = await prisma.activityLog.findMany({
    where: { target_type: "INVENTORY" },
    orderBy: { timestamp: "desc" },
    take: 10,
    select: {
      id: true,
      action: true,
      target_id: true,
      timestamp: true,
    },
  });

  const inventoryIds = [
    ...new Set(activities.map((activity) => activity.target_id)),
  ];

  const inventories = await prisma.inventory.findMany({
    where: { id: { in: inventoryIds } },
    select: { id: true, name: true },
  });

  const inventoryMap = Object.fromEntries(
    inventories.map((inv) => [inv.id, inv.name])
  );

  return activities.map((activity) => ({
    id: activity.id,
    item: inventoryMap[activity.target_id] || "Unknown Item",
    action: activity.action,
    timestamp: activity.timestamp.toISOString(),
  }));
}

export async function getAssetTypeDistribution() {
  const { user } = await getCurrentSession();
  if (!user) throw new Error("Not Authorized");
  const assetCategoryCounts = await prisma.asset.groupBy({
    by: ["type_id"],
    _count: { type_id: true },
  });

  const categories = await prisma.assetType.findMany({
    where: { id: { in: assetCategoryCounts.map((item) => item.type_id) } },
    select: { category: true },
  });

  const mergedCounts = categories.reduce(
    (acc: Record<string, number>, category, index) => {
      const count = assetCategoryCounts[index]?._count.type_id || 0;
      if (acc[category.category]) {
        acc[category.category] += count;
      } else {
        acc[category.category] = count;
      }
      return acc;
    },
    {}
  );

  const colorPalette = ["#3b82f6", "#16a34a", "#f59e0b", "#8b5cf6", "#6b7280"];

  return Object.entries(mergedCounts).map(([name, value], index) => ({
    name,
    value,
    fill: colorPalette[index % colorPalette.length],
  }));
}

export async function getAssetLifecycleData() {
  const { user } = await getCurrentSession();
  if (!user) throw new Error("Not Authorized");
  const lifecycleCounts = await prisma.assetLifecycle.groupBy({
    by: ["stage"],
    _count: { stage: true },
  });

  const colorMapping = {
    BARU: "#3b82f6",
    DIGUNAKAN: "#16a34a",
    PERBAIKAN: "#f59e0b",
    DIHAPUS: "#6b7280",
  };

  return lifecycleCounts.map((item) => ({
    name: item.stage,
    value: item._count.stage,
    fill: colorMapping[item.stage],
  }));
}

export async function getAssetStatusData() {
  const assetStatusCounts = await prisma.asset.groupBy({
    by: ["status"],
    _count: { status: true },
  });

  const colorMapping = {
    AKTIF: "#16a34a",
    TIDAK_AKTIF: "#f59e0b",
    RUSAK: "#dc2626",
  };

  return assetStatusCounts.map((item) => ({
    name: item.status,
    value: item._count.status,
    fill: colorMapping[item.status],
  }));
}

export async function getAssetLocationData() {
  const { user } = await getCurrentSession();
  if (!user) throw new Error("Not Authorized");
  const locationCounts = await prisma.assetLocationHistory.groupBy({
    by: ["location_id"],
    _count: { location_id: true },
  });

  const locations = await prisma.location.findMany({
    where: { id: { in: locationCounts.map((item) => item.location_id) } },
    select: { id: true, type: true },
  });

  const groupedByType = locations.reduce(
    (acc: Record<string, number>, location) => {
      const count =
        locationCounts.find((item) => item.location_id === location.id)?._count
          .location_id || 0;
      if (acc[location.type]) {
        acc[location.type] += count;
      } else {
        acc[location.type] = count;
      }
      return acc;
    },
    {} as Record<keyof typeof colorMapping, number>
  );

  const colorMapping = {
    GUDANG: "#8b5cf6",
    KANTOR: "#ec4899",
    DATA_CENTER: "#06b6d4",
  };

  return Object.entries(groupedByType).map(([type, value]) => ({
    name: type,
    value,
    fill: colorMapping[type as keyof typeof colorMapping],
  }));
}
