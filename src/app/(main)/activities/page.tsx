import { getAllActivityLogs } from "@/actions/activities-actions";
import { DataTable } from "@/components/table/data-table";
import React from "react";
import { activityLogColumns } from "./_components/collumn";

export const dynamic = "force-dynamic";

export default async function page() {
  const data = await getAllActivityLogs();
  return (
    <div className="flex flex-col w-full h-full items-center pt-4">
      <DataTable columns={activityLogColumns} data={data} />
    </div>
  );
}
