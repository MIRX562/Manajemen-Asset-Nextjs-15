import { DataTable } from "@/components/table/data-table";
import React from "react";
import InsertDataDialog from "@/components/table/insertDataButton";
import { inventoryColumns } from "./_components/collumn";
import { getAllInventoryItems } from "@/actions/inventory-actions";
import AddInventoryForm from "./_components/form-add";
import InventoryMetrics from "./_components/metrics";
import RecentUpdatesWidget from "./_components/recent-updates";
import QuickActionsInventory from "./_components/quick-actions";

export default async function InventoryPage() {
  const data = await getAllInventoryItems();
  return (
    <div className="flex flex-col w-full h-full items-center pt-4 space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 w-full">
        <InventoryMetrics />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
          <RecentUpdatesWidget />
          <QuickActionsInventory />
        </div>
      </div>
      <DataTable columns={inventoryColumns} data={data} />
    </div>
  );
}
