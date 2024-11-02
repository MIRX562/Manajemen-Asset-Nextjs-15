"use client";

import { useState } from "react";
import { Bell, Check, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

type Notification = {
	id: string;
	title: string;
	description: string;
	time: string;
	read: boolean;
};

const mockNotifications: Notification[] = [
	{
		id: "1",
		title: "New message",
		description: "You have a new message from John Doe",
		time: "5 min ago",
		read: false,
	},
	{
		id: "2",
		title: "Payment received",
		description: "Your account has been credited with $100",
		time: "1 hour ago",
		read: false,
	},
	{
		id: "3",
		title: "Update available",
		description: "A new version of the app is available",
		time: "2 hours ago",
		read: true,
	},
	{
		id: "4",
		title: "Friend request",
		description: "Jane Smith sent you a friend request",
		time: "1 day ago",
		read: true,
	},
	{
		id: "5",
		title: "Reminder",
		description: "Don'apost forget your appointment tomorrow",
		time: "2 days ago",
		read: true,
	},
];

export default function NotificationTray() {
	const [notifications, setNotifications] =
		useState<Notification[]>(mockNotifications);
	const [open, setOpen] = useState(false);

	const unreadCount = notifications.filter((n) => !n.read).length;

	const markAsRead = (id: string) => {
		setNotifications(
			notifications.map((n) => (n.id === id ? { ...n, read: true } : n))
		);
	};

	const deleteNotification = (id: string) => {
		setNotifications(notifications.filter((n) => n.id !== id));
	};

	const markAllAsRead = () => {
		setNotifications(notifications.map((n) => ({ ...n, read: true })));
	};

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
					<Button variant="ghost" size="sm" onClick={markAllAsRead}>
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
										!notification.read && "bg-muted/50"
									)}
								>
									<div className="flex items-start justify-between">
										<div className="space-y-1">
											<p className="text-sm font-medium">
												{notification.title}
											</p>
											<p className="text-sm text-muted-foreground">
												{notification.description}
											</p>
											<p className="text-xs text-muted-foreground">
												{notification.time}
											</p>
										</div>
										<div className="flex items-center space-x-2">
											{!notification.read && (
												<Button
													variant="ghost"
													size="icon"
													onClick={() => markAsRead(notification.id)}
												>
													<Check className="h-4 w-4" />
													<span className="sr-only">Mark as read</span>
												</Button>
											)}
											<Button
												variant="ghost"
												size="icon"
												onClick={() => deleteNotification(notification.id)}
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
