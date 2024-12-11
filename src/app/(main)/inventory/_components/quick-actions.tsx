import { Button } from "@/components/ui/button";
import {
  ArchiveRestore,
  Download,
  PlusCircle,
  PlusCircleIcon,
} from "lucide-react";
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
    <div className="grid grid-cols-3 md:grid-cols-1 gap-4">
      <Button
        variant="outline"
        className="shadow-md flex text-xl items-center justify-between font-medium gap-2 w-full h-full"
      >
        <ArchiveRestore /> Restock Item
      </Button>
      <Dialog>
        <DialogTrigger asChild>
          <Button className="h-full text-xl font-medium justify-between">
            <PlusCircleIcon size={40} />
            Add Item
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogTitle>Add Inventory</DialogTitle>
          <AddInventoryForm />
        </DialogContent>
      </Dialog>
      <Button
        variant="outline"
        className="shadow-md flex text-xl items-center justify-between font-medium gap-2 w-full h-full"
      >
        <Download /> Export Items
      </Button>
    </div>
  );
}
