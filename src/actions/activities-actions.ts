"use server";
import { getCurrentSession } from "@/lib/auth";
import prisma from "@/lib/db";
import { TargetType } from "@prisma/client";

export async function createActivityLog(data: {
  action: string;
  target_type: TargetType;
  target_id: number;
}) {
  const { user } = await getCurrentSession();
  if (!user) {
    throw new Error("Not Authorized");
  }
  return await prisma.activityLog.create({
    data: {
      user_id: user.id,
      action: data.action,
      target_type: data.target_type,
      target_id: data.target_id,
    },
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

export async function getUserActivityLog() {
  const { user } = await getCurrentSession();
  if (!user) {
    return null;
  }
  return await prisma.activityLog.findMany({
    where: { user_id: user.id },
  });
}
