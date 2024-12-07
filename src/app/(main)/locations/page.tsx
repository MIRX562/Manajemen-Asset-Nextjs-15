import { DataTable } from "@/components/table/data-table";
import React from "react";
import InsertDataDialog from "@/components/table/insertDataButton";
import { locationColumns } from "./_components/collumn";
import { getAllLocations } from "@/actions/location-actions";
import AddLocationForm from "./_components/form-add";

export default async function LocationPage() {
  const data = await getAllLocations();
  return (
    <div className="flex flex-col w-full h-full items-center pt-4">
      <DataTable
        columns={locationColumns}
        data={data}
        insertDataComponent={
          <InsertDataDialog triggerButtonText="Add Asset">
            <AddLocationForm />
          </InsertDataDialog>
        }
      />
    </div>
  );
}
