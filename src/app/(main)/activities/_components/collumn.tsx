"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/table/data-table-column-header";

export const activityLogColumns: ColumnDef<{
  id: number;
  user_id: number;
  action: string;
  target_type: string;
  target_id: number;
  timestamp: Date; // ISO timestamp
  user: {
    id: number;
    username: string;
    email: string;
    role: string;
  };
}>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Log ID" />
    ),
    cell: ({ row }) => <div>{row.getValue("id")}</div>,
    enableSorting: true,
  },
  {
    accessorKey: "user.username",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="User" />
    ),
    cell: ({ row }) => (
      <div>{row.original.user?.username ?? "Unknown User"}</div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: "action",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Action" />
    ),
    cell: ({ row }) => <div>{row.getValue("action")}</div>,
    enableSorting: true,
  },
  {
    accessorKey: "target_type",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Target Type" />
    ),
    cell: ({ row }) => <div>{row.getValue("target_type")}</div>,
    enableSorting: true,
  },
  {
    accessorKey: "target_id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Target ID" />
    ),
    cell: ({ row }) => <div>{row.getValue("target_id")}</div>,
    enableSorting: true,
  },
  {
    accessorKey: "timestamp",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Timestamp" />
    ),
    cell: ({ row }) => (
      <div>
        {new Date(row.getValue("timestamp")).toLocaleString("id", {
          dateStyle: "medium",
          timeStyle: "short",
        })}
      </div>
    ),
    enableSorting: true,
  },
];
