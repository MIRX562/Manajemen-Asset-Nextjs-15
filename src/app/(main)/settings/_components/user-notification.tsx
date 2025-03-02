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

export default function UserNotification() {
  return (
    <Card className="col-span-full md:col-span-1 lg:col-span-2">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Bell className="mr-2" /> Notifications
        </CardTitle>
      </CardHeader>
      <CardContent className="max-h-[320px] overflow-auto mb-4">
        <ul className="space-y-2">
          <li className="bg-secondary p-2 rounded">
            New asset assigned - Asset ID: 78
          </li>
          <li className="bg-secondary p-2 rounded">
            Maintenance request - ID: 45
          </li>
          <li className="bg-secondary p-2 rounded">
            New asset assigned - Asset ID: 78
          </li>
          <li className="bg-secondary p-2 rounded">
            Maintenance request - ID: 45
          </li>
          <li className="bg-secondary p-2 rounded">
            New asset assigned - Asset ID: 78
          </li>
          <li className="bg-secondary p-2 rounded">
            Maintenance request - ID: 45
          </li>
          <li className="bg-secondary p-2 rounded">
            New asset assigned - Asset ID: 78
          </li>
          <li className="bg-secondary p-2 rounded">
            Maintenance request - ID: 45
          </li>
          <li className="bg-secondary p-2 rounded">
            New asset assigned - Asset ID: 78
          </li>
          <li className="bg-secondary p-2 rounded">
            Maintenance request - ID: 45
          </li>
          <li className="bg-secondary p-2 rounded">
            New asset assigned - Asset ID: 78
          </li>
          <li className="bg-secondary p-2 rounded">
            Maintenance request - ID: 45
          </li>
          <li className="bg-secondary p-2 rounded">
            New asset assigned - Asset ID: 78
          </li>
          <li className="bg-secondary p-2 rounded">
            Maintenance request - ID: 45
          </li>
          <li className="bg-secondary p-2 rounded">
            New asset assigned - Asset ID: 78
          </li>
          <li className="bg-secondary p-2 rounded">
            Maintenance request - ID: 45
          </li>
          <li className="bg-secondary p-2 rounded">
            New asset assigned - Asset ID: 78
          </li>
          <li className="bg-secondary p-2 rounded">
            Maintenance request - ID: 45
          </li>
          <li className="bg-secondary p-2 rounded">
            New asset assigned - Asset ID: 78
          </li>
          <li className="bg-secondary p-2 rounded">
            Maintenance request - ID: 45
          </li>
          <li className="bg-secondary p-2 rounded">
            New asset assigned - Asset ID: 78
          </li>
          <li className="bg-secondary p-2 rounded">
            Maintenance request - ID: 45
          </li>
        </ul>
      </CardContent>
      <CardFooter>
        <Button variant="outline" size="sm">
          Mark All as Read
        </Button>
      </CardFooter>
    </Card>
  );
}
