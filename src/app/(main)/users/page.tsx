import { DataTable } from "@/components/table/data-table";
import prisma from "@/lib/db";
import React from "react";
import { userColumns } from "./_components/collumn";
import InsertDataDialog from "@/components/table/insertDataButton";
import AddUserForm from "./_components/form-add";

export default async function page() {
  const data = await prisma.user.findMany({
    include: {
      Session: true,
    },
  });

  return (
    <div className="flex flex-col w-full h-full items-center pt-4">
      <DataTable
        columns={userColumns}
        data={data}
        insertDataComponent={
          <InsertDataDialog triggerButtonText="Add User">
            <AddUserForm />
          </InsertDataDialog>
        }
      />
    </div>
  );
}
