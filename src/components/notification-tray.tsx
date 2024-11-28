// components/NotificationTray.tsx

"use client";

import { useState, useTransition } from "react";
import { Bell, Check, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { deleteNotification, markAsRead } from "@/actions/notification-actions";
import { useNotifications } from "@/context/notifications";

export default function NotificationTray() {
  const { notifications, setNotifications } = useNotifications();
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleMarkAsRead = (id: number) => {
    startTransition(async () => {
      await markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
      );
    });
  };

  const handleDeleteNotification = (id: number) => {
    startTransition(async () => {
      await deleteNotification(id);
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    });
  };

  const handleMarkAllAsRead = () => {
    startTransition(async () => {
      await Promise.all(
        notifications
          .filter((notification) => !notification.is_read)
          .map((notification) => markAsRead(notification.id))
      );
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    });
  };

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute top-0 right-0 h-3 w-3 rounded-full bg-red-500 flex items-center justify-center text-[10px] text-white">
              {unreadCount}
            </span>
          )}
          <span className="sr-only">Toggle notifications</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">Notifications</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleMarkAllAsRead}
            disabled={isPending}
          >
            Mark all as read
          </Button>
        </div>
        <ScrollArea className="h-[300px]">
          {notifications.length === 0 ? (
            <p className="text-center text-muted-foreground p-4">
              No notifications
            </p>
          ) : (
            <ul className="divide-y">
              {notifications.map((notification) => (
                <li
                  key={notification.id}
                  className={cn(
                    "p-4 transition-colors hover:bg-muted",
                    !notification.is_read && "bg-muted/50"
                  )}
                >
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <p className="text-sm font-medium">
                        {notification.message}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {notification.message}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(notification.created_at).toLocaleTimeString()}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      {!notification.is_read && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleMarkAsRead(notification.id)}
                          disabled={isPending}
                        >
                          <Check className="h-4 w-4" />
                          <span className="sr-only">Mark as read</span>
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() =>
                          handleDeleteNotification(notification.id)
                        }
                        disabled={isPending}
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete notification</span>
                      </Button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}
