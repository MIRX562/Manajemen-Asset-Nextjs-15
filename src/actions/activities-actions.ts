"use server";
import prisma from "@/lib/db";

export async function getRecentActivities() {
  const activities = await prisma.activityLog.findMany({
    include: {
      user: {
        select: { username: true },
      },
    },
    orderBy: {
      timestamp: "desc",
    },
    take: 5, // Limit to 10 recent activities
  });

  return activities.map((activity) => ({
    id: activity.id,
    action: activity.action,
    item: `${activity.target_type} #${activity.target_id}`,
    user: activity.user.username || "Unknown",
    date: activity.timestamp.toISOString().split("T")[0], // Format as YYYY-MM-DD
  }));
}

// Create a new ActivityLog record
export async function createActivityLog(data: {
  user_id: number;
  action: string;
  target_type: "ASSET" | "INVENTORY" | "MAINTENANCE";
  target_id: number;
}) {
  return await prisma.activityLog.create({
    data,
  });
}

// Get all ActivityLog records
export async function getAllActivityLogs() {
  return await prisma.activityLog.findMany({
    include: {
      user: true, // Include user details
    },
    orderBy: {
      timestamp: "desc",
    },
  });
}

// Get ActivityLog records by User ID
export async function getActivityLogsByUserId(user_id: number) {
  return await prisma.activityLog.findMany({
    where: { user_id },
    include: {
      user: true,
    },
    orderBy: {
      timestamp: "desc",
    },
  });
}

// Get ActivityLog records by Target Type and ID
export async function getActivityLogsByTarget(
  target_type: "ASSET" | "INVENTORY" | "MAINTENANCE",
  target_id: number
) {
  return await prisma.activityLog.findMany({
    where: {
      target_type,
      target_id,
    },
    include: {
      user: true,
    },
    orderBy: {
      timestamp: "desc",
    },
  });
}

// Get ActivityLog record by ID
export async function getActivityLogById(id: number) {
  return await prisma.activityLog.findUnique({
    where: { id },
    include: {
      user: true,
    },
  });
}

// Delete an ActivityLog record
export async function deleteActivityLog(id: number) {
  return await prisma.activityLog.delete({
    where: { id },
  });
}

// Get ActivityLogs filtered by time range
export async function getActivityLogsByTimeRange(start: Date, end: Date) {
  return await prisma.activityLog.findMany({
    where: {
      timestamp: {
        gte: start,
        lte: end,
      },
    },
    include: {
      user: true,
    },
    orderBy: {
      timestamp: "desc",
    },
  });
}
