import { fetchNotifications } from "@/actions/notification-actions";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Bell } from "lucide-react";
import React from "react";

export default async function UserNotification() {
  const notifications = await fetchNotifications();
  return (
    <Card className="col-span-full md:col-span-1 lg:col-span-2">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Bell className="mr-2" /> Notifications
        </CardTitle>
      </CardHeader>
      <CardContent className="max-h-[320px] overflow-auto mb-4">
        <ul className="space-y-2">
          {notifications.length > 0 ? (
            notifications.map((notification) => (
              <li key={notification.id} className="bg-secondary p-2 rounded">
                {notification.type} - {notification.message}
              </li>
            ))
          ) : (
            <li>No notification yet</li>
          )}
        </ul>
      </CardContent>
      <CardFooter></CardFooter>
    </Card>
  );
}
