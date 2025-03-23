"use server";

import prisma from "@/lib/db";
import { notificationEmitter } from "@/lib/eventEmitter";
import { NotificationType } from "@prisma/client";

//create notification record and trigger sse endpoint
export async function createNotification(
  userId: number,
  message: string,
  type: NotificationType
) {
  const notification = await prisma.notifications.create({
    data: { user_id: userId, message, type },
  });

  // Emit event when a new notification is created
  notificationEmitter.emit("new_notification", notification);

  return notification;
}

// Server Action: Fetch notifications
export async function fetchNotifications() {
  return await prisma.notifications.findMany({
    orderBy: { created_at: "desc" },
  });
}

// Server Action: Delete a notifications
export async function deleteNotification(id: number) {
  await prisma.notifications.delete({
    where: { id },
  });
}
