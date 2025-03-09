import { DataTable } from "@/components/table/data-table";
import prisma from "@/lib/db";
import React from "react";
import { employeeColumns } from "./_components/collumn";
import InsertDataDialog from "@/components/table/insertDataButton";
import AddEmployeeForm from "./_components/form-add";

export const dynamic = "force-dynamic";

export default async function page() {
  const data = await prisma.employee.findMany({});

  return (
    <div className="flex flex-col w-full h-full items-center pt-4 gap-4">
      <DataTable
        columns={employeeColumns}
        data={data}
        insertDataComponent={
          <InsertDataDialog triggerButtonText="Add Employee">
            <AddEmployeeForm />
          </InsertDataDialog>
        }
      />
    </div>
  );
}
