import { getAllAssetTypes } from "@/actions/asset-type-actions";
import { DataTable } from "@/components/table/data-table";
import React from "react";
import { assetTypeColumns } from "./_components/collumn";
import InsertDataDialog from "@/components/table/insertDataButton";
import AddAssetTypeForm from "./_components/form-add";

export default async function page() {
  const data = await getAllAssetTypes();

  return (
    <div className="flex flex-col w-full h-full items-center pt-4">
      <DataTable
        columns={assetTypeColumns}
        data={data}
        insertDataComponent={
          <InsertDataDialog triggerButtonText="Add Type">
            <AddAssetTypeForm />
          </InsertDataDialog>
        }
      />
    </div>
  );
}
