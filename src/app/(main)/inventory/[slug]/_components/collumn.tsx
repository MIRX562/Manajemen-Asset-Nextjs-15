"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/table/data-table-column-header";
import { MaintenanceStatus } from "@prisma/client";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";

export const inventoryMaintenanceUsageColumns: ColumnDef<{
  maintenance: {
    status: MaintenanceStatus;
  };
  maintenance_id: number;
  quantity_used: number;
  updated_at: Date;
}>[] = [
  //   {
  //     accessorKey: "id",
  //     header: ({ column }) => (
  //       <DataTableColumnHeader column={column} title="Log ID" />
  //     ),
  //     cell: ({ row }) => <div>{row.getValue("id")}</div>,
  //     enableSorting: true,
  //   },
  {
    accessorKey: "user.username",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Maintenance ID" />
    ),
    cell: ({ row }) => <div>{row.original.maintenance_id}</div>,
    enableSorting: true,
  },
  {
    accessorKey: "maintenance.status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => (
      <div>
        {row.getValue("maintenance.status") == MaintenanceStatus.SELESAI ? (
          <Badge>Used</Badge>
        ) : (
          <Badge>In Queue</Badge>
        )}
      </div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: "quantity_used",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Quanttity Used" />
    ),
    cell: ({ row }) => <div>{row.getValue("quantity_used")}</div>,
    enableSorting: true,
  },
  {
    accessorKey: "updated_at",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Updated At" />
    ),
    cell: ({ row }) => <div>{formatDate(row.getValue("updated_at"))}</div>,
    enableSorting: true,
  },
];
