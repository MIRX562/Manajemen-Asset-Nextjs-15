"use server";

import { getCurrentSession } from "@/lib/auth";
import prisma from "@/lib/db";
import { notificationEmitter } from "@/lib/eventEmitter";
import { NotificationType } from "@prisma/client";

export async function createNotification(
  userId: number,
  message: string,
  type: NotificationType,
  link: string
) {
  const { user } = await getCurrentSession();
  if (!user) throw new Error("Not Authorized");
  const notification = await prisma.notifications.create({
    data: { user_id: userId, message, type, link },
  });

  notificationEmitter.emit("new_notification", notification);

  return notification;
}

export async function fetchNotifications(userId: number) {
  const { user } = await getCurrentSession();
  if (!user) throw new Error("Not Authorized");
  return await prisma.notifications.findMany({
    where: { user_id: userId },
    orderBy: [{ is_read: "asc" }, { created_at: "desc" }],
  });
}

export async function markNotificationAsRead(id: number) {
  const { user } = await getCurrentSession();
  if (!user) throw new Error("Not Authorized");
  return await prisma.notifications.update({
    where: { id },
    data: { is_read: true },
  });
}
export async function markAllNotificationAsRead(user_id: number) {
  const { user } = await getCurrentSession();
  if (!user) throw new Error("Not Authorized");
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

export async function deleteNotification(id: number) {
  const { user } = await getCurrentSession();
  if (!user) throw new Error("Not Authorized");
  await prisma.notifications.delete({
    where: { id },
  });
}
