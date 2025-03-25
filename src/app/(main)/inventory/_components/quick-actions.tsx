import { Button } from "@/components/ui/button";
import { ArchiveRestore, Download, PlusCircleIcon } from "lucide-react";
import React from "react";
import AddInventoryForm from "./form-add";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import RestockForm from "./form-restock";
import UseItemsForm from "./form-use";

type Item = { id: number; name: string; stock: number };

export default function QuickActionsInventory({
  formData,
}: {
  formData: Item[];
}) {
  return (
    <div className="w-full md:h-full flex md:flex-col items-center justify-between">
      <Dialog>
        <DialogTrigger asChild>
          <Button className="bg-chart-1 shadow-md h-fit flex flex-col text-xl font-medium p-3">
            <PlusCircleIcon />
            Add Item
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogTitle>Add Inventory</DialogTitle>
          <AddInventoryForm />
        </DialogContent>
      </Dialog>
      <Dialog>
        <DialogTrigger asChild>
          <Button className="bg-chart-2 shadow-md h-fit flex flex-col text-xl items-center font-medium p-3">
            <ArchiveRestore /> Restock
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogTitle>Restock Inventory Items</DialogTitle>
          <RestockForm items={formData} />
        </DialogContent>
      </Dialog>
      <Dialog>
        <DialogTrigger asChild>
          <Button className="bg-chart-5 shadow-md h-fit flex flex-col text-xl items-center font-medium p-3">
            <Download /> Use Item
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogTitle>Use Inventory Items</DialogTitle>
          <UseItemsForm items={formData} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
