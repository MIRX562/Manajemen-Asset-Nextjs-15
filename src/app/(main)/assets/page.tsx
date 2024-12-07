import { getAllAssets } from "@/actions/assets-actions";
import { DataTable } from "@/components/table/data-table";
import React from "react";
import { assetColumns } from "./_components/collumn";
import InsertDataDialog from "@/components/table/insertDataButton";
import AddAssetForm from "./_components/form-add";
import { getAllAssetTypes } from "@/actions/asset-type-actions";

export default async function AssetsPage() {
  const data = await getAllAssets();
  const assetType = await getAllAssetTypes();
  return (
    <div className="flex flex-col w-full h-full items-center pt-4">
      <DataTable
        columns={assetColumns}
        data={data}
        insertDataComponent={
          <InsertDataDialog triggerButtonText="Add Asset">
            <AddAssetForm assetType={assetType} />
          </InsertDataDialog>
        }
      />
    </div>
  );
}
