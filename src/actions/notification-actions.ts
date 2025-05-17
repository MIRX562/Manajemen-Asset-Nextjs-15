"use server";

import prisma from "@/lib/db";
import { notificationEmitter } from "@/lib/eventEmitter";
import { NotificationType } from "@prisma/client";

//create notification record and trigger sse endpoint
export async function createNotification(
  userId: number,
  message: string,
  type: NotificationType,
  link: string
) {
  const notification = await prisma.notifications.create({
    data: { user_id: userId, message, type, link },
  });

  // Emit event when a new notification is created
  notificationEmitter.emit("new_notification", notification);

  return notification;
}

// Server Action: Fetch notifications for a specific user
export async function fetchNotifications(userId: number) {
  return await prisma.notifications.findMany({
    where: { user_id: userId },
    orderBy: [{ is_read: "asc" }, { created_at: "desc" }],
  });
}

// Server Action: Mark notification as read
export async function markNotificationAsRead(id: number) {
  return await prisma.notifications.update({
    where: { id },
    data: { is_read: true },
  });
}
export async function markAllNotificationAsRead(user_id: number) {
  return await prisma.notifications.updateMany({
    where: {
      AND: {
        user_id: user_id,
        is_read: false,
      },
    },
    data: { is_read: true },
  });
}

// Server Action: Delete a notifications
export async function deleteNotification(id: number) {
  await prisma.notifications.delete({
    where: { id },
  });
}
