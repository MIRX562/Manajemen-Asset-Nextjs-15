"use client";

import { useEffect } from "react";
import { Bell, Check, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useNotificationStore } from "@/stores/notification-store";
import { useUserStore } from "@/stores/user-store";
import type { NotificationType } from "@prisma/client";

interface Notification {
  id: string;
  title: string;
  description: string;
  time: string;
  read: boolean;
  type: NotificationType;
  link: string;
}

export default function NotificationTray() {
  const notifications = useNotificationStore((state) => state.notifications);
  const setNotifications = useNotificationStore(
    (state) => state.setNotifications
  );
  const addNotifications = useNotificationStore(
    (state) => state.addNotifications
  );
  const markAsRead = useNotificationStore((state) => state.markAsRead);
  const markAllAsRead = useNotificationStore((state) => state.markAllAsRead);
  const clearAll = useNotificationStore((state) => state.clearAll);
  const user = useUserStore((state) => state.user);

  useEffect(() => {
    if (!user) return;
    // Fetch notifications for the current user
    const fetchNotifications = async () => {
      const res = await fetch("/api/notifications");
      if (res.ok) {
        const data = await res.json();
        setNotifications(data);
      }
    };
    fetchNotifications();
    // Listen for new notifications via SSE
    const eventSource = new EventSource("/api/notifications/stream");
    eventSource.onmessage = (event) => {
      const newNotification = JSON.parse(event.data);
      // Only add if for this user
      if (newNotification.user_id === user.id) {
        addNotifications([newNotification]);
      }
    };
    return () => {
      eventSource.close();
    };
  }, [user, setNotifications, addNotifications]);

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  const getTypeIcon = (type: NotificationType) => {
    switch (type) {
      case "INFO":
        return <Info className="h-4 w-4 text-blue-500" />;
      case "SUCCESS":
        return <Check className="h-4 w-4 text-green-500" />;
      case "WARNING":
        return <Info className="h-4 w-4 text-amber-500" />;
      case "ERROR":
        return <Info className="h-4 w-4 text-red-500" />;
      case "MESSAGE":
        return <Info className="h-4 w-4 text-cyan-500" />;
      case "SYSTEM":
        return <Info className="h-4 w-4 text-gray-500" />;
      case "MAINTENANCE":
        return <Info className="h-4 w-4 text-indigo-500" />;
      default:
        return <Info className="h-4 w-4 text-muted-foreground" />;
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative rounded-full">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
              {unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <Card className="border-0 shadow-none">
          <CardHeader className="border-b py-3 px-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">
                Notifications
              </CardTitle>
              {unreadCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => markAllAsRead(user.id)}
                  className="h-auto text-xs p-0 font-normal"
                >
                  Mark all as read
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="max-h-[350px] overflow-y-auto p-0">
            {notifications.length > 0 ? (
              <div>
                {[...notifications]
                  .sort((a, b) =>
                    a.is_read === b.is_read ? 0 : a.is_read ? 1 : -1
                  )
                  .map((notification) => (
                    <div
                      key={notification.id}
                      className={cn(
                        "flex items-start gap-3 p-4 border-b last:border-0 transition-colors cursor-pointer hover:bg-muted/70",
                        !notification.is_read && "bg-muted/50"
                      )}
                      onClick={(e) => {
                        if ((e.target as HTMLElement).closest("button")) return;
                        if (notification.link)
                          window.location.href = notification.link;
                        if (!notification.is_read) {
                          markAsRead(notification.id);
                          // Optionally: call API to mark as read
                        }
                      }}
                    >
                      <div className="mt-1">
                        {getTypeIcon(notification.type)}
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium">
                            {notification.message}
                          </p>
                          {!notification.is_read && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                              onClick={(e) => {
                                e.stopPropagation();
                                markAsRead(notification.id);
                              }}
                            >
                              <span className="sr-only">Mark as read</span>
                              <Check className="h-3 w-3" />
                            </Button>
                          )}
                        </div>
                        {notification.link && (
                          <p className="text-xs text-muted-foreground">
                            {notification.link}
                          </p>
                        )}
                        <p className="text-xs text-muted-foreground">
                          {new Date(notification.created_at).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center p-6 text-center">
                <Bell className="h-10 w-10 text-muted-foreground/50 mb-2" />
                <p className="text-sm font-medium">No notifications</p>
                <p className="text-xs text-muted-foreground">
                  You're all caught up!
                </p>
              </div>
            )}
          </CardContent>
          {notifications.length > 0 && (
            <CardFooter className="border-t p-2">
              <Button
                variant="ghost"
                size="sm"
                className="w-full text-xs"
                onClick={clearAll}
              >
                Clear all
              </Button>
            </CardFooter>
          )}
        </Card>
      </PopoverContent>
    </Popover>
  );
}
