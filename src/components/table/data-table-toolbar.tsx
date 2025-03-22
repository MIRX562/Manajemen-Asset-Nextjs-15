/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Table } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Cross2Icon } from "@radix-ui/react-icons";
import { DataTableViewOptions } from "./data-table-view-options";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  insertDataComponent?: React.ReactNode; // Accept the entire component for creating a user
}

export function DataTableToolbar<TData>({
  table,
  insertDataComponent,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;
  const selectedRows = table.getSelectedRowModel().rows; // Get selected rows

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Search all columns..."
          value={table.getState().globalFilter ?? ""}
          onChange={(event) => table.setGlobalFilter(event.target.value)}
          className="h-8 w-[150px] lg:w-[250px] shadow-md"
        />
        {/* Uncomment and use these if needed for filters */}
        {/* {table.getColumn("status") && (
					<DataTableFacetedFilter
						column={table.getColumn("status")}
						title="Status"
						options={statuses}
					/>
				)}
				{table.getColumn("priority") && (
					<DataTableFacetedFilter
						column={table.getColumn("priority")}
						title="Priority"
						options={priorities}
					/>
				)} */}
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <Cross2Icon className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
      <div className="flex gap-2 items-center justify-around">
        {/* Action buttons for selected rows */}
        {selectedRows.length > 0 && (
          <>
            <Button
              variant="destructive"
              size="sm"
              className="h-8"
              onClick={() => handleDeleteSelected(selectedRows)}
            >
              Delete Selected ({selectedRows.length})
            </Button>
            <Button
              variant="secondary"
              size="sm"
              className="h-8"
              onClick={() => handleExportSelected(selectedRows)}
            >
              Export Selected ({selectedRows.length})
            </Button>
          </>
        )}

        {/* Render the create user component */}
        <div>{insertDataComponent}</div>

        <DataTableViewOptions table={table} />
      </div>
    </div>
  );
}

// Example handler for deleting selected rows
function handleDeleteSelected(selectedRows: any[]) {
  if (
    confirm(`Are you sure you want to delete ${selectedRows.length} items?`)
  ) {
    // Add your delete logic here
    console.log("Deleting selected rows:", selectedRows);
  }
}

// Example handler for exporting selected rows
function handleExportSelected(selectedRows: any[]) {
  // Add your export logic here
  console.log("Exporting selected rows:", selectedRows);
}
