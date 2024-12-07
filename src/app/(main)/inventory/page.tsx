import { DataTable } from "@/components/table/data-table";
import React from "react";
import InsertDataDialog from "@/components/table/insertDataButton";
import { inventoryColumns } from "./_components/collumn";
import { getAllInventoryItems } from "@/actions/inventory-actions";
import AddInventoryForm from "./_components/form-add";

export default async function InventoryPage() {
  const data = await getAllInventoryItems();
  return (
    <div className="flex flex-col w-full h-full items-center pt-4">
      <DataTable
        columns={inventoryColumns}
        data={data}
        insertDataComponent={
          <InsertDataDialog triggerButtonText="Add Asset">
            <AddInventoryForm />
          </InsertDataDialog>
        }
      />
    </div>
  );
}
