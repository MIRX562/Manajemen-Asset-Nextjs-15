"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/table/data-table-column-header";
import { DataTableRowActions } from "@/components/table/data-table-row-actions";
import { Location } from "@prisma/client"; // Replace with your actual Location schema import
import { formatDate } from "@/lib/utils";
import { deleteLocation } from "@/actions/location-actions";
import EditLocationForm from "./form-edit";

export const locationColumns: ColumnDef<Location>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="ID" />
    ),
    cell: ({ row }) => <div>{row.getValue("id")}</div>,
    enableSorting: true,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => (
      <div className="truncate font-medium">{row.getValue("name")}</div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: "address",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Address" />
    ),
    cell: ({ row }) => (
      <div className="truncate max-w-[300px] text-sm">
        {row.getValue("address")}
      </div>
    ),
    enableSorting: false,
  },
  {
    accessorKey: "type",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Type" />
    ),
    cell: ({ row }) => <div className="uppercase">{row.getValue("type")}</div>,
    enableSorting: true,
  },
  {
    accessorKey: "created_at",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Created At" />
    ),
    cell: ({ row }) => (
      <div>{formatDate(new Date(row.getValue("created_at")))}</div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: "updated_at",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Updated At" />
    ),
    cell: ({ row }) => (
      <div>{formatDate(new Date(row.getValue("updated_at")))}</div>
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
        EditComponent={EditLocationForm}
        onDelete={deleteLocation}
        viewRoute="/locations"
      />
    ),
  },
];
