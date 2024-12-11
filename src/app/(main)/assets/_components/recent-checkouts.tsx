import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const recentCheckouts = [
  {
    id: 1,
    assetName: "Laptop Dell XPS 15",
    username: "john.doe",
    checkOutDate: "2023-06-15",
    expectedReturnDate: "2023-06-22",
    status: "DIPINJAM",
  },
  {
    id: 2,
    assetName: "iPhone 13 Pro",
    username: "jane.smith",
    checkOutDate: "2023-06-14",
    expectedReturnDate: "2023-06-21",
    status: "DIPINJAM",
  },
  {
    id: 3,
    assetName: "Projector Sony VPL-PHZ10",
    username: "mike.johnson",
    checkOutDate: "2023-06-13",
    expectedReturnDate: "2023-06-20",
    status: "DIKEMBALIKAN",
  },
];

export function RecentCheckouts() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Asset</TableHead>
          <TableHead>User</TableHead>
          <TableHead>Check-Out Date</TableHead>
          <TableHead>Expected Return</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {recentCheckouts.map((checkout) => (
          <TableRow key={checkout.id}>
            <TableCell>{checkout.assetName}</TableCell>
            <TableCell>{checkout.username}</TableCell>
            <TableCell>{checkout.checkOutDate}</TableCell>
            <TableCell>{checkout.expectedReturnDate}</TableCell>
            <TableCell>
              <span
                className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${
                  checkout.status === "DIPINJAM"
                    ? "bg-yellow-200 text-yellow-800"
                    : "bg-green-200 text-green-800"
                }`}
              >
                {checkout.status}
              </span>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
