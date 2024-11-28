// context/NotificationContext.tsx
"use client";

import { Notifications } from "@prisma/client";
import React, { createContext, useContext, useEffect, useState } from "react";

type NotificationContextType = {
  notifications: Notifications[];
  setNotifications: React.Dispatch<React.SetStateAction<Notifications[]>>;
};

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [notifications, setNotifications] = useState<Notifications[]>([]);

  useEffect(() => {
    const eventSource = new EventSource("/api/notifications/stream");

    eventSource.onmessage = (event) => {
      const newNotifications: Notifications[] = JSON.parse(event.data);
      setNotifications((prev) => [
        ...newNotifications,
        ...prev.filter(
          (prevNotification) =>
            !newNotifications.some(
              (newNotification) => newNotification.id === prevNotification.id
            )
        ),
      ]);
    };

    return () => {
      eventSource.close();
    };
  }, []);

  return (
    <NotificationContext.Provider value={{ notifications, setNotifications }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotifications must be used within a NotificationProvider"
    );
  }
  return context;
};
