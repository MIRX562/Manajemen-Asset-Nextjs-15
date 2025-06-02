"use server";

import { CheckOutForm } from "@/app/(main)/assets/checkout/_components/form-checkout";
import { getCurrentSession } from "@/lib/auth";
import prisma from "@/lib/db";
import { createActivityLog } from "./activities-actions";

export async function checkoutAsset(data: CheckOutForm) {
  const { user } = await getCurrentSession();
  if (!user) throw new Error("Not Authorized");
  if (!data) {
    throw new Error("no data recieved");
  }

  return await prisma.$transaction(async (tx) => {
    const checkout = await tx.checkInOut.create({
      data: {
        asset_id: data.asset_id,
        user_id: user.id,
        employee_id: data.employee_id,
        check_out_date: data.check_out_date,
        expected_return_date: data.expected_return_date,
        status: "DIPINJAM",
      },
    });

    await tx.assetLifecycle.create({
      data: {
        asset_id: data.asset_id,
        stage: "DIGUNAKAN",
        change_date: new Date(),
      },
    });

    await tx.activityLog.create({
      data: {
        user_id: user.id,
        action: "Checkout Asset",
        target_type: "ASSET",
        target_id: data.asset_id,
        timestamp: new Date(),
      },
    });

    return checkout;
  });
}

export async function checkIn(data: { id: number; actual_return_date: Date }) {
  const { user } = await getCurrentSession();
  if (!user) throw new Error("Not Authorized");
  if (!data) {
    throw Error;
  }
  try {
    const checkIn = await prisma.checkInOut.update({
      where: {
        id: data.id,
      },
      data: {
        actual_return_date: data.actual_return_date,
        status: "DIKEMBALIKAN",
      },
    });
    createActivityLog({
      action: `CheckIn asset`,
      target_type: "CHECKOUT",
      target_id: checkIn.id,
    });
  } catch (error) {
    console.error(
      "[createCheckInOut] Failed to create CheckInOut record:",
      error
    );
    throw new Error("Failed to create CheckInOut record. Please try again.");
  }
}

export async function updateCheckInOut(
  id: number,
  data: {
    actual_return_date?: Date;
    status?: "DIPINJAM" | "DIKEMBALIKAN";
  }
) {
  const { user } = await getCurrentSession();
  if (!user) throw new Error("Not Authorized");
  try {
    const update = await prisma.checkInOut.update({
      where: { id },
      data,
    });

    createActivityLog({
      action: `Update checkout`,
      target_type: "CHECKOUT",
      target_id: update.id,
    });
  } catch (error) {
    console.error(
      `[updateCheckInOut] Failed to update CheckInOut record with ID ${id}:`,
      error
    );
    throw new Error(
      "Failed to update the CheckInOut record. Please try again."
    );
  }
}

export async function deleteCheckInOut(id: number) {
  const { user } = await getCurrentSession();
  if (!user) throw new Error("Not Authorized");
  try {
    await prisma.checkInOut.delete({
      where: { id },
    });
    createActivityLog({
      action: `Deleted checkout`,
      target_type: "CHECKOUT",
      target_id: id,
    });
  } catch (error) {
    console.error(
      `[deleteCheckInOut] Failed to delete CheckInOut record with ID ${id}:`,
      error
    );
    throw new Error(
      "Failed to delete the CheckInOut record. Please try again."
    );
  }
}

export async function getAllCheckInOuts() {
  const { user } = await getCurrentSession();
  if (!user) throw new Error("Not Authorized");
  try {
    return await prisma.checkInOut.findMany({
      include: {
        asset: {
          select: {
            name: true,
          },
        },
        user: {
          select: {
            username: true,
          },
        },
        employee: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        id: "desc",
      },
    });
  } catch (error) {
    console.error(
      "[getAllCheckInOuts] Failed to retrieve CheckInOut records:",
      error
    );
    throw new Error("Failed to retrieve CheckInOut records. Please try again.");
  }
}

export async function getAllActiveCheckoutsForm() {
  const { user } = await getCurrentSession();
  if (!user) throw new Error("Not Authorized");
  try {
    return await prisma.checkInOut.findMany({
      where: {
        actual_return_date: null,
      },
      select: {
        id: true,
        asset: {
          select: {
            name: true,
          },
        },
      },
    });
  } catch (error) {
    console.error(
      "[getAllActiveCheckoutsForm] Failed to retrieve active checkouts:",
      error
    );
    throw new Error("Failed to retrieve active checkouts. Please try again.");
  }
}

export async function getCheckInOutById(id: number) {
  const { user } = await getCurrentSession();
  if (!user) throw new Error("Not Authorized");
  try {
    const record = await prisma.checkInOut.findUnique({
      where: { id },
      include: {
        asset: true,
        user: true,
      },
    });
    if (!record) {
      throw new Error(`No CheckInOut record found with ID: ${id}`);
    }
    return record;
  } catch (error) {
    console.error(
      `[getCheckInOutById] Failed to retrieve record for ID ${id}:`,
      error
    );
    throw new Error(
      "Failed to retrieve the CheckInOut record. Please try again."
    );
  }
}

export async function getCheckInOutsByAssetId(asset_id: number) {
  const { user } = await getCurrentSession();
  if (!user) throw new Error("Not Authorized");
  try {
    return await prisma.checkInOut.findMany({
      where: { asset_id },
      include: {
        asset: true,
        user: true,
      },
    });
  } catch (error) {
    console.error(
      `[getCheckInOutsByAssetId] Failed to retrieve records for Asset ID ${asset_id}:`,
      error
    );
    throw new Error(
      "Failed to retrieve CheckInOut records for the specified asset. Please try again."
    );
  }
}

export async function getCheckInOutsByUserId(user_id: number) {
  const { user } = await getCurrentSession();
  if (!user) throw new Error("Not Authorized");
  try {
    return await prisma.checkInOut.findMany({
      where: { user_id },
      include: {
        asset: true,
        user: true,
      },
    });
  } catch (error) {
    console.error(
      `[getCheckInOutsByUserId] Failed to retrieve records for User ID ${user_id}:`,
      error
    );
    throw new Error(
      "Failed to retrieve CheckInOut records for the specified user. Please try again."
    );
  }
}

export async function getCheckInOutsByEmployeeId(employee_id: number) {
  const { user } = await getCurrentSession();
  if (!user) throw new Error("Not Authorized");
  try {
    return await prisma.checkInOut.findMany({
      where: { employee_id },
      select: {
        id: true,
        check_out_date: true,
        expected_return_date: true,
        actual_return_date: true,
        status: true,
        asset: {
          select: {
            name: true,
          },
        },
      },
    });
  } catch (error) {
    console.error(
      `[getCheckInOutsByUserId] Failed to retrieve records for employee ID ${employee_id}:`,
      error
    );
    throw new Error(
      "Failed to retrieve CheckInOut records for the specified user. Please try again."
    );
  }
}

export async function getActiveCheckOuts() {
  const { user } = await getCurrentSession();
  if (!user) throw new Error("Not Authorized");
  try {
    return await prisma.checkInOut.findMany({
      where: { status: "DIPINJAM" },
      select: {
        id: true,
      },
    });
  } catch (error) {
    console.error(
      `[getCheckInOutsByUserId] Failed to retrieve records for User ID:`,
      error
    );
    throw new Error(
      "Failed to retrieve CheckInOut records for the specified user. Please try again."
    );
  }
}

export async function getActiveCheckInOuts() {
  const { user } = await getCurrentSession();
  if (!user) throw new Error("Not Authorized");
  try {
    return await prisma.checkInOut.findMany({
      where: { actual_return_date: null },
      include: {
        asset: {
          select: {
            name: true,
          },
        },
        user: {
          select: {
            username: true,
          },
        },
        employee: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        id: "desc",
      },
    });
  } catch (error) {
    console.error(
      "[getActiveCheckInOuts] Failed to retrieve active CheckInOut records:",
      error
    );
    throw new Error(
      "Failed to retrieve active CheckInOut records. Please try again."
    );
  }
}

export async function getOverdueCheckInOuts(currentDate: Date) {
  const { user } = await getCurrentSession();
  if (!user) throw new Error("Not Authorized");
  try {
    return await prisma.checkInOut.findMany({
      where: {
        expected_return_date: { lt: currentDate },
        actual_return_date: null,
      },
      include: {
        asset: true,
        user: true,
      },
    });
  } catch (error) {
    console.error(
      "[getOverdueCheckInOuts] Failed to retrieve overdue CheckInOut records:",
      error
    );
    throw new Error(
      "Failed to retrieve overdue CheckInOut records. Please try again."
    );
  }
}

export async function getUserReturnStats(user_id: number) {
  const { user } = await getCurrentSession();
  if (!user) throw new Error("Not Authorized");
  try {
    const [totalBorrowed, totalReturned] = await Promise.all([
      prisma.checkInOut.count({
        where: { user_id, status: "DIPINJAM" },
      }),
      prisma.checkInOut.count({
        where: { user_id, status: "DIKEMBALIKAN" },
      }),
    ]);
    return { totalBorrowed, totalReturned };
  } catch (error) {
    console.error(
      `[getUserReturnStats] Failed to retrieve return stats for User ID ${user_id}:`,
      error
    );
    throw new Error(
      "Failed to retrieve user return statistics. Please try again."
    );
  }
}

export async function getAssetUsageHistory(asset_id: number) {
  const { user } = await getCurrentSession();
  if (!user) throw new Error("Not Authorized");
  try {
    return await prisma.checkInOut.findMany({
      where: { asset_id },
      orderBy: { check_out_date: "desc" },
      include: {
        user: true,
      },
    });
  } catch (error) {
    console.error(
      `[getAssetUsageHistory] Failed to retrieve usage history for Asset ID ${asset_id}:`,
      error
    );
    throw new Error(
      "Failed to retrieve asset usage history. Please try again."
    );
  }
}

export const getCheckoutMetrics = async () => {
  const { user } = await getCurrentSession();
  if (!user) throw new Error("Not Authorized");
  const checkedOutAssets = await prisma.checkInOut.count({
    where: {
      status: "DIPINJAM",
    },
  });

  const availableAssets = await prisma.asset.count({
    where: {
      status: "AKTIF",
      checkInOuts: {
        none: {
          status: "DIPINJAM",
        },
      },
    },
  });

  const overdueCheckouts = await prisma.checkInOut.count({
    where: {
      status: "DIPINJAM",
      expected_return_date: {
        lt: new Date(),
      },
      actual_return_date: null,
    },
  });

  const checkoutsInProgress = await prisma.checkInOut.count({
    where: {
      status: "DIPINJAM",
    },
  });

  return {
    checkedOutAssets,
    availableAssets,
    overdueCheckouts,
    checkoutsInProgress,
  };
};
