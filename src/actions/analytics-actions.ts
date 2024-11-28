"use server";

import prisma from "@/lib/db";

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
      where: { quantity: { lte: 2 } },
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
