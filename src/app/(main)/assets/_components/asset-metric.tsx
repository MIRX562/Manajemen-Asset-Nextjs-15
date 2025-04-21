import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import prisma from "@/lib/db";

export default async function AssetMetrics() {
  const [totalAssets, activeAssets, checkedOutAssets, overdueAssets] =
    await Promise.all([
      prisma.asset.count(),
      prisma.asset.count({ where: { status: "AKTIF" } }),
      prisma.checkInOut.count({ where: { status: "DIPINJAM" } }),
      prisma.checkInOut.count({ where: { status: "JATUH_TEMPO" } }),
    ]);

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Assets</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalAssets}</div>
          <p className="text-xs text-muted-foreground">+12 from last month</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Assets</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{activeAssets}</div>
          <p className="text-xs text-muted-foreground">82% of total assets</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Checked Out</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{checkedOutAssets}</div>
          <p className="text-xs text-muted-foreground">12% of total assets</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Overdue</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-destructive">
            {overdueAssets}
          </div>
          <p className="text-xs text-muted-foreground">2% of total assets</p>
        </CardContent>
      </Card>
    </div>
  );
}
