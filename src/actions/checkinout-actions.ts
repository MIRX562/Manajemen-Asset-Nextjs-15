"use server";
import prisma from "@/lib/db";

// Create a CheckInOut record
export async function createCheckInOut(data: {
  asset_id: number;
  user_id: number;
  check_out_date: Date;
  expected_return_date: Date;
  status: "DIPINJAM" | "DIKEMBALIKAN";
}) {
  try {
    return await prisma.checkInOut.create({ data });
  } catch (error) {
    console.error(
      "[createCheckInOut] Failed to create CheckInOut record:",
      error
    );
    throw new Error("Failed to create CheckInOut record. Please try again.");
  }
}

// Get all CheckInOut records
export async function getAllCheckInOuts() {
  try {
    return await prisma.checkInOut.findMany({
      include: {
        asset: true,
        user: true,
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

// Get CheckInOut record by ID
export async function getCheckInOutById(id: number) {
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

// Get CheckInOut records by Asset ID
export async function getCheckInOutsByAssetId(asset_id: number) {
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

// Get CheckInOut records by User ID
export async function getCheckInOutsByUserId(user_id: number) {
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

// Update a CheckInOut record
export async function updateCheckInOut(
  id: number,
  data: {
    actual_return_date?: Date;
    status?: "DIPINJAM" | "DIKEMBALIKAN";
  }
) {
  try {
    return await prisma.checkInOut.update({
      where: { id },
      data,
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

// Delete a CheckInOut record
export async function deleteCheckInOut(id: number) {
  try {
    return await prisma.checkInOut.delete({
      where: { id },
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

// Get active CheckInOuts (currently borrowed)
export async function getActiveCheckInOuts() {
  try {
    return await prisma.checkInOut.findMany({
      where: { status: "DIPINJAM" },
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

// Get overdue CheckInOuts
export async function getOverdueCheckInOuts(currentDate: Date) {
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

// Get return statistics for a user
export async function getUserReturnStats(user_id: number) {
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

// Get usage history for an asset
export async function getAssetUsageHistory(asset_id: number) {
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
  const checkedOutAssets = await prisma.checkInOut.count({
    where: {
      status: "DIPINJAM",
    },
  });

  const availableAssets = await prisma.asset.count({
    where: {
      checkInOuts: {
        every: {
          status: "DIKEMBALIKAN",
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
