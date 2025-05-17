import { create } from "zustand";
import { Notifications } from "@prisma/client";
import { markAllAsReadClient, markAsReadClient } from "./notification-client";

interface NotificationState {
  notifications: Notifications[];
  setNotifications: (notifications: Notifications[]) => void;
  addNotifications: (newNotifications: Notifications[]) => void;
  markAsRead: (id: number) => void;
  markAllAsRead: (user_id: number) => void;
  clearAll: () => void;
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: [],
  setNotifications: (notifications) => set({ notifications }),
  addNotifications: (newNotifications) => {
    const prev = get().notifications;
    const merged = [
      ...newNotifications,
      ...prev.filter(
        (prevNotification) =>
          !newNotifications.some((n) => n.id === prevNotification.id)
      ),
    ];
    set({ notifications: merged });
  },
  markAsRead: async (id) => {
    await markAsReadClient(id);
    set({
      notifications: get().notifications.map((n) =>
        n.id === id ? { ...n, is_read: true } : n
      ),
    });
  },
  markAllAsRead: async (user_id) => {
    await markAllAsReadClient(user_id);
    set({
      notifications: get().notifications.map((n) => ({ ...n, is_read: true })),
    });
  },
  clearAll: () => set({ notifications: [] }),
}));
