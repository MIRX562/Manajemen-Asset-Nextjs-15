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
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatRelative } from "date-fns";

export async function UpcomingMaintenanceTable() {
  const data = await getUpcomingMaintenance(); // Fetch upcoming maintenance data

  return (
    <Card className="col-span-5">
      <CardHeader>
        <CardTitle>Upcoming Maintenance</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px]">
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
                  <TableCell>
                    {formatRelative(maintenance.date, new Date())}
                  </TableCell>
                  <TableCell>{maintenance.assignee}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
