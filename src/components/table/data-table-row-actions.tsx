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
import { TrashIcon, EyeIcon } from "lucide-react";
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
        <Tooltip>
          <TooltipTrigger>
            <Button
              variant="ghost"
              size="icon"
              className="p-2"
              aria-label="View"
              onClick={() =>
                router.push(
                  `${viewRoute}/${data.name || data.model}?id=${data.id}`
                )
              }
            >
              <EyeIcon className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>View Detail</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger>
            <Dialog>
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
              <TooltipContent>
                <p>Edit Data</p>
              </TooltipContent>

              <DialogContent>
                <DialogTitle>Edit</DialogTitle>
                <EditComponent data={data} />
              </DialogContent>
            </Dialog>
          </TooltipTrigger>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger>
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
