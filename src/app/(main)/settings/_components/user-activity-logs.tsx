import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FileText } from "lucide-react";
import React from "react";

export default function UserActivityLogs() {
  return (
    <Card className="col-span-full">
      <CardHeader>
        <CardTitle className="flex items-center">
          <FileText className="mr-2" /> Activity Logs
        </CardTitle>
      </CardHeader>
      <CardContent className="max-h-[400px] overflow-auto mb-4">
        <ul className="space-y-2">
          <li className="bg-secondary p-2 rounded">
            DELETE - MAINTENANCE - 17 - 2024-12-09 20:57:57
          </li>
          <li className="bg-secondary p-2 rounded">
            UPDATE - ASSET - 23 - 2024-12-08 15:30:22
          </li>
          <li className="bg-secondary p-2 rounded">
            CREATE - USER - 5 - 2024-12-07 09:15:43
          </li>
          <li className="bg-secondary p-2 rounded">
            DELETE - MAINTENANCE - 17 - 2024-12-09 20:57:57
          </li>
          <li className="bg-secondary p-2 rounded">
            UPDATE - ASSET - 23 - 2024-12-08 15:30:22
          </li>
          <li className="bg-secondary p-2 rounded">
            CREATE - USER - 5 - 2024-12-07 09:15:43
          </li>
          <li className="bg-secondary p-2 rounded">
            DELETE - MAINTENANCE - 17 - 2024-12-09 20:57:57
          </li>
          <li className="bg-secondary p-2 rounded">
            UPDATE - ASSET - 23 - 2024-12-08 15:30:22
          </li>
          <li className="bg-secondary p-2 rounded">
            CREATE - USER - 5 - 2024-12-07 09:15:43
          </li>
          <li className="bg-secondary p-2 rounded">
            DELETE - MAINTENANCE - 17 - 2024-12-09 20:57:57
          </li>
          <li className="bg-secondary p-2 rounded">
            UPDATE - ASSET - 23 - 2024-12-08 15:30:22
          </li>
          <li className="bg-secondary p-2 rounded">
            CREATE - USER - 5 - 2024-12-07 09:15:43
          </li>
          <li className="bg-secondary p-2 rounded">
            DELETE - MAINTENANCE - 17 - 2024-12-09 20:57:57
          </li>
          <li className="bg-secondary p-2 rounded">
            UPDATE - ASSET - 23 - 2024-12-08 15:30:22
          </li>
          <li className="bg-secondary p-2 rounded">
            CREATE - USER - 5 - 2024-12-07 09:15:43
          </li>
        </ul>
      </CardContent>
      <CardFooter>
        <Button variant="link">View All Logs</Button>
      </CardFooter>
    </Card>
  );
}
