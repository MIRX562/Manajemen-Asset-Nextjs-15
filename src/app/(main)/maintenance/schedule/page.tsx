import { DataTable } from "@/components/table/data-table";
import React from "react";
import {
  getScheduledMaintenance,
  getScheduledMaintenanceMetrics,
} from "@/actions/maintenance-actions";
import { fullMaintenanceColumns } from "../_components/collumn";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import ScheduleMaintenanceForm from "../_components/form-schedule";
import { getAvailableAssets } from "@/actions/assets-actions";
import { getAvailableInventoryItems } from "@/actions/inventory-actions";

export default async function MaintenancePage() {
  const data = await getScheduledMaintenance();
  const metrics = await getScheduledMaintenanceMetrics();
  const assets = await getAvailableAssets();
  const inventory = await getAvailableInventoryItems();
  return (
    <div className="flex flex-col w-full h-full pt-4 gap-4">
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
      <Card>
        <CardHeader>
          <CardTitle>Schedule Maintenance</CardTitle>
          <CardDescription>Schedule new maintenance</CardDescription>
        </CardHeader>
        <CardContent>
          <ScheduleMaintenanceForm assets={assets} inventoryItems={inventory} />
        </CardContent>
      </Card>
      <h1 className="text-3xl font-bold">All Scheduled Maintenance</h1>
      <DataTable columns={fullMaintenanceColumns} data={data} />
    </div>
  );
}
