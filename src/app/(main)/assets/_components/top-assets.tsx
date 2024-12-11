import { BarChart } from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const topAssets = [
  { name: "Laptop Dell XPS 15", checkouts: 45 },
  { name: "iPhone 13 Pro", checkouts: 38 },
  { name: "Projector Sony VPL-PHZ10", checkouts: 32 },
  { name: 'MacBook Pro 16"', checkouts: 28 },
  { name: 'iPad Pro 12.9"', checkouts: 25 },
];

export function TopAssets() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Asset Name</TableHead>
          <TableHead>Total Check-Outs</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {topAssets.map((asset) => (
          <TableRow key={asset.name}>
            <TableCell>{asset.name}</TableCell>
            <TableCell>
              <div className="flex items-center">
                <BarChart className="mr-2 h-4 w-4 text-muted-foreground" />
                {asset.checkouts}
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
