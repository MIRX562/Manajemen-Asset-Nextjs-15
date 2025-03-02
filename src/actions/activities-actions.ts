"use server";
import prisma from "@/lib/db";

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

export async function getAllActivityLogs() {
  return await prisma.activityLog.findMany({
    include: {
      user: {
        select: {
          id: true,
          username: true,
          email: true,
          role: true,
        },
      }, // Include user details
    },
    orderBy: {
      timestamp: "desc",
    },
  });
}

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

export async function getActivityLogById(id: number) {
  return await prisma.activityLog.findUnique({
    where: { id },
    include: {
      user: true,
    },
  });
}
