"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/table/data-table-column-header";
import { formatCurrency } from "@/lib/utils";
import { DataTableRowActions } from "@/components/table/data-table-row-actions";
import EditInventoryForm from "./form-edit";
import { deleteAsset } from "@/actions/assets-actions";

export const inventoryColumns: ColumnDef<{
  id: number;
  name: string;
  category: string;
  quantity: number;
  reorder_level: number;
  unit_price: number;
  location?: { name: string } | null;
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
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Inventory Name" />
    ),
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("name")}</div>
    ),
  },
  {
    accessorKey: "category",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Category" />
    ),
    cell: ({ row }) => <div>{row.getValue("category")}</div>,
  },
  {
    accessorKey: "quantity",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Quantity" />
    ),
    cell: ({ row }) => <div>{row.getValue("quantity")}</div>,
  },
  {
    accessorKey: "reorder_level",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Reorder Level" />
    ),
    cell: ({ row }) => <div>{row.getValue("reorder_level")}</div>,
  },
  {
    accessorKey: "unit_price",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Unit Price" />
    ),
    cell: ({ row }) => <div>{formatCurrency(row.getValue("unit_price"))}</div>,
  },
  {
    accessorKey: "location.name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Location" />
    ),
    cell: ({ row }) =>
      row.original.location ? (
        <div>{row.original.location.name}</div>
      ) : (
        <div>Unassigned</div>
      ),
  },
  {
    accessorKey: "created_at",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Created At" />
    ),
    cell: ({ row }) => (
      <div>{new Date(row.getValue("created_at")).toLocaleDateString()}</div>
    ),
    enableSorting: true,
  },
  {
    id: "actions",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Actions" />
    ),
    cell: ({ row }) => (
      <DataTableRowActions
        row={row}
        EditComponent={EditInventoryForm}
        onDelete={deleteAsset}
        viewRoute="/assets"
      />
    ),
  },
];
