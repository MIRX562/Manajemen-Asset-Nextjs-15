"use client";
import { ComponentType } from "react";
import { Row } from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import { Pencil2Icon } from "@radix-ui/react-icons";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { TrashIcon, Eye } from "lucide-react";
import { toast } from "sonner";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
  EditComponent: ComponentType<{ data: TData }>;
  onDelete: (data: TData) => void;
  viewRoute: string; // Base route for the "View" button
}

export function DataTableRowActions<TData>({
  row,
  EditComponent,
  onDelete,
  viewRoute,
}: DataTableRowActionsProps<TData>) {
  const router = useRouter();
  const data = row.original;

  return (
    <TooltipProvider>
      <div className="flex space-x-2">
        {/* View Action */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="p-2"
              aria-label="View"
              onClick={() =>
                router.push(
                  `${viewRoute}/${
                    data.name || data.model || data.username
                  }?id=${data.id}`
                )
              }
            >
              <Eye className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>View Detail</p>
          </TooltipContent>
        </Tooltip>

        {/* Edit Action */}
        <Dialog>
          <Tooltip>
            <TooltipTrigger asChild>
              <DialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="p-2"
                  aria-label="Edit"
                >
                  <Pencil2Icon className="h-4 w-4" />
                </Button>
              </DialogTrigger>
            </TooltipTrigger>
            <TooltipContent>
              <p>Edit Data</p>
            </TooltipContent>
          </Tooltip>
          <DialogContent>
            <DialogTitle>Edit</DialogTitle>
            <EditComponent data={data} />
          </DialogContent>
        </Dialog>

        {/* Delete Action */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="p-2 text-destructive"
              aria-label="Delete"
              onClick={() =>
                toast.warning("Delete this item?", {
                  action: {
                    label: "Delete",
                    onClick: () => {
                      onDelete(data);
                      router.refresh();
                    },
                  },
                })
              }
            >
              <TrashIcon className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Delete Data</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
}
