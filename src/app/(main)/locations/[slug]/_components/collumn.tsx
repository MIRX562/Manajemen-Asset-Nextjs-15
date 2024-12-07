"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/table/data-table-column-header";
import { formatDate } from "@/lib/utils";

export const assetLocationHistoryColumns: ColumnDef<{
  id: number;
  asset_id: number;
  location_id: number;
  assigned_date: Date;
  release_date: Date | null;
  asset: { name: string };
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
    cell: ({ row }) => <div>{row.original.asset.name}</div>,
    enableSorting: true,
  },
  {
    id: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const assignedDate = new Date(row.original.assigned_date);
      const releaseDate = row.original.release_date
        ? new Date(row.original.release_date)
        : null;

      if (releaseDate) {
        return <div>Released on {formatDate(releaseDate)}</div>;
      }
      return <div>Assigned</div>;
    },
    enableSorting: false,
  },
];

export const simplifiedInventoryColumns: ColumnDef<{
  name: string;
  quantity: number;
}>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Inventory Name" />
    ),
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("name")}</div>
    ),
  },
  {
    accessorKey: "quantity",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Quantity" />
    ),
    cell: ({ row }) => <div>{row.getValue("quantity")}</div>,
  },
];
