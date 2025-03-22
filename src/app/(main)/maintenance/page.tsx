import { DataTable } from "@/components/table/data-table";
import React from "react";
import {
  getAllMaintenances,
  getScheduledMaintenanceMetrics,
} from "@/actions/maintenance-actions";
import { fullMaintenanceColumns } from "./_components/collumn";
import MaintenanceMetrics from "./_components/metrics";

export const dynamic = "force-dynamic";

export default async function MaintenancePage() {
  const data = await getAllMaintenances();
  const metrics = await getScheduledMaintenanceMetrics();

  return (
    <div className="flex flex-col w-full max-h-full items-center pt-4 space-y-4">
      <MaintenanceMetrics metrics={metrics} />
      <DataTable columns={fullMaintenanceColumns} data={data} />
    </div>
  );
}
