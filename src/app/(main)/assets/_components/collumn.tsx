"use client";

import { ColumnDef } from "@tanstack/react-table";

import { Checkbox } from "@/components/ui/checkbox";
import { DataTableColumnHeader } from "@/components/table/data-table-column-header";
import { DataTableRowActions } from "@/components/table/data-table-row-actions";
import { Asset } from "@prisma/client"; // Replace with your Asset schema import
import { deleteAsset } from "@/actions/assets-actions";
import EditAssetForm from "./form-edit";
import { calculateCurrentValue, formatCurrency } from "@/lib/utils";

export const assetColumns: ColumnDef<Asset>[] = [
  // {
  //   id: "select",
  //   header: ({ table }) => (
  //     <Checkbox
  //       checked={
  //         table.getIsAllPageRowsSelected() ||
  //         (table.getIsSomePageRowsSelected() && "indeterminate")
  //       }
  //       onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
  //       aria-label="Select all"
  //       className="translate-y-[2px]"
  //     />
  //   ),
  //   cell: ({ row }) => (
  //     <Checkbox
  //       checked={row.getIsSelected()}
  //       onCheckedChange={(value) => row.toggleSelected(!!value)}
  //       aria-label="Select row"
  //       className="translate-y-[2px]"
  //     />
  //   ),
  //   enableSorting: false,
  //   enableHiding: false,
  // },
  {
    accessorKey: "id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Id" />
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
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => <div className="truncate">{row.getValue("status")}</div>,
  },
  {
    accessorKey: "initial_value",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Initial Value" />
    ),
    cell: ({ row }) => (
      <div>{formatCurrency(row.getValue("initial_value"))}</div>
    ),
  },
  {
    accessorKey: "current_value",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Current Value" />
    ),
    cell: ({ row }) => {
      const initialValue = row.original.initial_value;
      const salvageValue = row.original.salvage_value;
      const usefulLife = row.original.useful_life;
      const purchaseDate = row.original.purchase_date;

      const currentValue = calculateCurrentValue(
        initialValue,
        salvageValue,
        usefulLife,
        purchaseDate
      );

      return <div>{formatCurrency(parseInt(currentValue))}</div>;
    },
    enableSorting: false,
  },
  {
    accessorKey: "purchase_date",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Purchase Date" />
    ),
    cell: ({ row }) => (
      <div>{new Date(row.getValue("purchase_date")).toLocaleDateString()}</div>
    ),
  },
  {
    id: "actions",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Actions" />
    ),
    cell: ({ row }) => (
      <DataTableRowActions
        row={row}
        EditComponent={EditAssetForm}
        onDelete={deleteAsset}
        viewRoute="/assets"
      />
    ),
  },
];
