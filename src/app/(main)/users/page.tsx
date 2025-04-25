import { DataTable } from "@/components/table/data-table";
import prisma from "@/lib/db";
import React from "react";
import { userColumns } from "./_components/collumn";
import InsertDataDialog from "@/components/table/insertDataButton";
import AddUserForm from "./_components/form-add";
import RbacWrapper from "@/components/rbac-wrapper";

export const dynamic = "force-dynamic";

export default async function page() {
  const data = await prisma.user.findMany({
    select: {
      id: true,
      username: true,
      email: true,
      role: true,
      Session: {
        select: {
          id: true,
        },
      },
    },
    orderBy: {
      id: "desc",
    },
  });

  return (
    <RbacWrapper requiredRole="ADMIN">
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
    </RbacWrapper>
  );
}
