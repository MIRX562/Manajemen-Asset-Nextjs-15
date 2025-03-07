import { getUserActivityLog } from "@/actions/activities-actions";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatDate } from "@/lib/utils";
import { FileText } from "lucide-react";
import React from "react";

export default async function UserActivityLogs() {
  const activities = await getUserActivityLog();
  if (!activities) {
    return null;
  }
  return (
    <Card className="col-span-full">
      <CardHeader>
        <CardTitle className="flex items-center">
          <FileText className="mr-2" /> Activity Logs
        </CardTitle>
      </CardHeader>
      <CardContent className="max-h-[400px] overflow-auto mb-4">
        <ul className="space-y-2">
          {activities.length == 0 && <p>no activity yet</p>}
          {activities?.map((activity) => (
            <li key={activity.id} className="bg-secondary p-2 rounded">
              {activity.action} - {activity.target_type}:{activity.target_id} -{" "}
              {formatDate(activity.timestamp.toString())}
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter></CardFooter>
    </Card>
  );
}
