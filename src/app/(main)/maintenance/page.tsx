import { DataTable } from "@/components/table/data-table";
import React from "react";
import {
  getAllMaintenances,
  getScheduledMaintenanceMetrics,
} from "@/actions/maintenance-actions";
import { fullMaintenanceColumns } from "./_components/collumn";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const dynamic = "force-dynamic";

export default async function MaintenancePage() {
  const data = await getAllMaintenances();
  const metrics = await getScheduledMaintenanceMetrics();

  return (
    <div className="flex flex-col w-full max-h-full items-center pt-4 space-y-4">
      <div className="grid grid-cols-5 gap-4">
        <Card className="col-span-full md:col-span-1 flex flex-col justify-between">
          <CardHeader>
            <CardTitle>Scheduled Maintenance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-6xl font-bold">
              {metrics.totalScheduledMaintenance}
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-full md:col-span-1 flex flex-col justify-between">
          <CardHeader>
            <CardTitle>Overdue Maintenance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-6xl font-bold">
              {metrics.overdueMaintenance}
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-full md:col-span-1 flex flex-col justify-between">
          <CardHeader>
            <CardTitle>Mechanics Assigned</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-6xl font-bold">{metrics.uniqueMechanics}</div>
          </CardContent>
        </Card>
        <Card className="col-span-full md:col-span-1 flex flex-col justify-between">
          <CardHeader>
            <CardTitle>Assets Scheduled</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-6xl font-bold">{metrics.uniqueAssets}</div>
          </CardContent>
        </Card>
        <Card className="col-span-full md:col-span-1 flex flex-col justify-between">
          <CardHeader>
            <CardTitle>Maintenance This Week</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-6xl font-bold">
              {metrics.maintenanceThisWeek}
            </div>
          </CardContent>
        </Card>
      </div>
      <DataTable columns={fullMaintenanceColumns} data={data} />
    </div>
  );
}
