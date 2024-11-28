// components/dashboard/RecentActivitiesTable.tsx

import { getRecentActivities } from "@/actions/activities-actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export async function RecentActivitiesTable() {
  const data = await getRecentActivities(); // Fetch recent activities using the server action

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activities</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Action</TableHead>
              <TableHead>Item</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((activity) => (
              <TableRow key={activity.id}>
                <TableCell>{activity.action}</TableCell>
                <TableCell>{activity.item}</TableCell>
                <TableCell>{activity.user}</TableCell>
                <TableCell>{activity.date}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
