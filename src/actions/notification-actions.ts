"use server";
import prisma from "@/lib/db";

// Server Action: Fetch notifications
export async function fetchNotifications() {
  return await prisma.notifications.findMany({
    orderBy: { created_at: "desc" },
  });
}

// Server Action: Mark a notifications as read
export async function markAsRead(id: number) {
  await prisma.notifications.update({
    where: { id },
    data: { is_read: true },
  });
}

// Server Action: Delete a notifications
export async function deleteNotification(id: number) {
  await prisma.notifications.delete({
    where: { id },
  });
}

// Create a new notification
export async function createNotification(data: {
  user_id: number;
  message: string;
  type: "PEMELIHARAAN" | "STOK_RENDAH" | "CHECKOUT_TERLAMBAT" | "STATUS_ASET";
}) {
  return await prisma.notifications.create({
    data,
  });
}

// Get all notifications for a user
export async function getNotificationsByUserId(user_id: number) {
  return await prisma.notifications.findMany({
    where: { user_id },
    orderBy: { created_at: "desc" },
  });
}

// Mark a notification as read
export async function markNotificationAsRead(id: number) {
  return await prisma.notifications.update({
    where: { id },
    data: { is_read: true },
  });
}

// Mark all notifications as read for a user
export async function markAllNotificationsAsRead(user_id: number) {
  return await prisma.notifications.updateMany({
    where: { user_id, is_read: false },
    data: { is_read: true },
  });
}

// Get unread notifications count for a user
export async function getUnreadNotificationsCount(user_id: number) {
  return await prisma.notifications.count({
    where: { user_id, is_read: false },
  });
}

// Get notifications by type for a user
export async function getNotificationsByType(
  user_id: number,
  type: "PEMELIHARAAN" | "STOK_RENDAH" | "CHECKOUT_TERLAMBAT" | "STATUS_ASET"
) {
  return await prisma.notifications.findMany({
    where: { user_id, type },
    orderBy: { created_at: "desc" },
  });
}
