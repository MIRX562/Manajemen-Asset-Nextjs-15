import { DataTable } from "@/components/table/data-table";
import React from "react";
import { getAllMaintenances } from "@/actions/maintenance-actions";
import { fullMaintenanceColumns } from "./_components/collumn";

export default async function MaintenancePage() {
  const data = await getAllMaintenances();
  return (
    <div className="flex flex-col w-full h-full items-center pt-4 space-y-4">
      <DataTable columns={fullMaintenanceColumns} data={data} />
    </div>
  );
}
