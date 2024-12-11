import { User } from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const topUsers = [
  { username: "john.doe", checkouts: 23 },
  { username: "jane.smith", checkouts: 19 },
  { username: "mike.johnson", checkouts: 17 },
  { username: "emily.brown", checkouts: 15 },
  { username: "david.wilson", checkouts: 12 },
];

export function TopUsers() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Username</TableHead>
          <TableHead>Total Check-Outs</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {topUsers.map((user) => (
          <TableRow key={user.username}>
            <TableCell>{user.username}</TableCell>
            <TableCell>
              <div className="flex items-center">
                <User className="mr-2 h-4 w-4 text-muted-foreground" />
                {user.checkouts}
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
