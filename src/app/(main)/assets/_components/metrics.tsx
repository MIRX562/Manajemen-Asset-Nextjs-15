import { Package, Clock, CheckCircle, BarChart } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import prisma from "@/lib/db";

export default async function AssetStats() {
  // Prisma queries to fetch the data
  const totalAssets = await prisma.asset.count();
  const checkedOutAssets = await prisma.checkInOut.count({
    where: {
      status: "DIPINJAM", // Adjust this value based on your `AssetStatus` enum
    },
  });
  const returnedAssets = await prisma.checkInOut.count({
    where: {
      status: "DIKEMBALIKAN", // Adjust this value based on your `AssetStatus` enum
    },
  });
  const overdueReturns = await prisma.checkInOut.count({
    where: {
      status: "JATUH_TEMPO", // Adjust this value based on your `AssetStatus` enum
    },
  });

  return (
    <div className="grid gap-4 grid-cols-2 w-full md:grid-cols-1 md:w-1/3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Assets</CardTitle>
          <Package className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalAssets}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Checked-Out Assets
          </CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{checkedOutAssets}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Returned Assets</CardTitle>
          <CheckCircle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{returnedAssets}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Overdue Returns</CardTitle>
          <BarChart className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{overdueReturns}</div>
        </CardContent>
      </Card>
    </div>
  );
}
