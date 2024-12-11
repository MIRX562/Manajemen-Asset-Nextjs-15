"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/table/data-table-column-header";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import Link from "next/link";

export const fullMaintenanceColumns: ColumnDef<{
  id: number;
  asset: { name: string };
  mechanic: { username: string };
  scheduled_date: Date;
  status: string;
  notes: string | null;
  inventoryItems: {
    quantity_used: number;
    inventory: { name: string };
  }[];
  created_at: Date;
  updated_at: Date;
}>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="ID" />
    ),
    cell: ({ row }) => <div>{row.getValue("id")}</div>,
    enableSorting: true,
  },
  {
    accessorKey: "asset.name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Asset Name" />
    ),
    cell: ({ row }) => <div>{row.original.asset?.name ?? "Unknown"}</div>,
  },
  {
    accessorKey: "mechanic.username",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Mechanic" />
    ),
    cell: ({ row }) => (
      <div>{row.original.mechanic?.username ?? "Unknown"}</div>
    ),
  },
  {
    accessorKey: "scheduled_date",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Scheduled Date" />
    ),
    cell: ({ row }) => (
      <div>{new Date(row.getValue("scheduled_date")).toLocaleDateString()}</div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => <div>{row.getValue("status")}</div>,
  },
  {
    accessorKey: "notes",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Notes" />
    ),
    cell: ({ row }) => <div>{row.getValue("notes") ?? "No Notes"}</div>,
  },
  {
    accessorKey: "inventoryItems",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Inventory Items" />
    ),
    cell: ({ row }) => (
      <ul>
        {row.original.inventoryItems?.map((item, index) => (
          <li key={index}>
            {item.quantity_used} x {item.inventory?.name ?? "Unknown"}
          </li>
        ))}
      </ul>
    ),
  },
  {
    id: "actions",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Action" />
    ),
    cell: ({ row }) => (
      <Link href={`/maintenance/${row.original.id}`}>
        <Button variant="ghost" size="icon" className="p-2" aria-label="View">
          <Eye className="h-4 w-4" />
        </Button>
      </Link>
    ),
  },
];
