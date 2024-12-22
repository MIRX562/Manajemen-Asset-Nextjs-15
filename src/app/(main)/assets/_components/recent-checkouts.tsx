import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import prisma from "@/lib/db";

export async function RecentCheckouts() {
  // Fetch recent checkouts from the database
  const recentCheckouts = await prisma.checkInOut.findMany({
    take: 10, // Limit to the 10 most recent records
    orderBy: {
      check_out_date: "desc",
    },
    select: {
      id: true,
      check_out_date: true,
      status: true,
      asset: {
        select: {
          name: true,
        },
      },
      user: {
        select: {
          username: true,
        },
      },
    },
  });

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Asset</TableHead>
          <TableHead>User</TableHead>
          <TableHead>Check-Out Date</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {recentCheckouts.map((checkout) => (
          <TableRow key={checkout.id}>
            <TableCell>{checkout.asset?.name}</TableCell>
            <TableCell>{checkout.user?.username}</TableCell>
            <TableCell>
              {new Date(checkout.check_out_date).toLocaleDateString()}
            </TableCell>
            <TableCell>
              <span
                className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${
                  checkout.status === "DIPINJAM"
                    ? "bg-yellow-200 text-yellow-800"
                    : checkout.status === "JATUH_TEMPO"
                    ? "bg-red-200 text-red-800"
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
