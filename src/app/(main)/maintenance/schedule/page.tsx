import { DataTable } from "@/components/table/data-table";
import React from "react";
import { getScheduledMaintenance } from "@/actions/maintenance-actions";
import { fullMaintenanceColumns } from "../_components/collumn";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import ScheduleMaintenanceForm from "../_components/form-schedule";
import { getAvailableAssets } from "@/actions/asset-actions";
import { getAvailableInventoryItems } from "@/actions/inventory-actions";

export const dynamic = "force-dynamic";

export default async function MaintenancePage() {
  const data = await getScheduledMaintenance();
  const assets = await getAvailableAssets();
  const inventory = await getAvailableInventoryItems();
  return (
    <div className="flex flex-col w-full max-h-screen pt-4 gap-4">
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
