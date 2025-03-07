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
