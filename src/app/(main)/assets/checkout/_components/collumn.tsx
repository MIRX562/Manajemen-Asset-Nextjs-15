"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/table/data-table-column-header";

export const activeCheckoutsColumns: ColumnDef<{
  id: number;
  asset_id: number;
  user_id: number;
  employee_id: number;
  check_out_date: Date;
  expected_return_date: Date;
  actual_return_date: Date | null;
  status: string; // Assuming $Enums.CheckInOutStatus resolves to a string
  created_at: Date;
  updated_at: Date;
  asset: { name: string };
  employee: { name: string };
  user: { username: string };
}>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Id" />
    ),
    cell: ({ row }) => <div>{row.original.id}</div>,
    enableSorting: true,
  },
  {
    accessorKey: "asset.name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Asset Name" />
    ),
    cell: ({ row }) => <div>{row.original.asset.name}</div>,
    enableSorting: true,
  },
  {
    accessorKey: "employee.name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Assigned To (Employee)" />
    ),
    cell: ({ row }) => <div>{row.original.employee.name}</div>,
    enableSorting: true,
  },
  {
    accessorKey: "user.username",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Assigned By (User)" />
    ),
    cell: ({ row }) => <div>{row.original.user.username}</div>,
    enableSorting: true,
  },
  {
    accessorKey: "check_out_date",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Checkout Date" />
    ),
    cell: ({ row }) => (
      <div>
        {new Date(row.original.check_out_date).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        })}
      </div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: "expected_return_date",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Expected Return Date" />
    ),
    cell: ({ row }) => (
      <div>
        {new Date(row.original.expected_return_date).toLocaleDateString(
          "en-US",
          {
            year: "numeric",
            month: "short",
            day: "numeric",
          }
        )}
      </div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: "actual_return_date",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Actual Return Date" />
    ),
    cell: ({ row }) => (
      <div>
        {row.original.actual_return_date
          ? new Date(row.original.actual_return_date).toLocaleDateString(
              "en-US",
              {
                year: "numeric",
                month: "short",
                day: "numeric",
              }
            )
          : "Not Returned"}
      </div>
    ),
    enableSorting: true,
  },
];
