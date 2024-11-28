// components/dashboard/UpcomingMaintenanceTable.tsx

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getUpcomingMaintenance } from "@/actions/maintenance-actions";

export async function UpcomingMaintenanceTable() {
  const data = await getUpcomingMaintenance(); // Fetch upcoming maintenance data

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upcoming Maintenance</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Asset</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Assignee</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((maintenance) => (
              <TableRow key={maintenance.id}>
                <TableCell>{maintenance.asset}</TableCell>
                <TableCell>{maintenance.date}</TableCell>
                <TableCell>{maintenance.assignee}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
