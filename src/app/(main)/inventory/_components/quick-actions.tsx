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

export default function QuickActionsInventory() {
  return (
    <div className="h-full flex md:flex-col justify-between gap-4">
      <Dialog>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            className="shadow-md h-fit flex flex-col text-xl font-medium justify-start "
          >
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
          <Button
            variant="outline"
            className="shadow-md h-fit flex flex-col text-xl items-center font-medium"
          >
            <ArchiveRestore /> Restock
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogTitle>Add Inventory</DialogTitle>
          <AddInventoryForm />
        </DialogContent>
      </Dialog>
      <Dialog>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            className="shadow-md h-fit flex flex-col text-xl items-center font-medium"
          >
            <Download /> Use Item
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogTitle>Add Inventory</DialogTitle>
          <AddInventoryForm />
        </DialogContent>
      </Dialog>
    </div>
  );
}
