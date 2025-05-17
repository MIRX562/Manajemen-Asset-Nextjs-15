"use client";

import {
  markNotificationAsRead,
  markAllNotificationAsRead,
} from "@/actions/notification-actions";

export const markAsReadClient = async (id: number) => {
  await markNotificationAsRead(id);
};

export const markAllAsReadClient = async (user_id: number) => {
  await markAllNotificationAsRead(user_id);
};
