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
import prisma from "@/lib/db";

type Item = { id: number; name: string; quantity: number };

export default async function QuickActionsInventory({
  formData,
}: {
  formData: Item[];
}) {
  const existingCategory = await prisma.inventory.findMany({
    select: {
      category: true,
    },
    distinct: ["category"],
  });
  return (
    <div className="w-full md:h-full flex md:flex-col items-center justify-between ">
      <Dialog>
        <DialogTrigger asChild>
          <Button className="bg-chart-4 text-white shadow-md h-fit flex flex-col text-xl font-medium p-3 w-full">
            <PlusCircleIcon />
            Add Item
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogTitle>Add Inventory</DialogTitle>
          <AddInventoryForm sugestion={existingCategory} />
        </DialogContent>
      </Dialog>
      <Dialog>
        <DialogTrigger asChild>
          <Button className="bg-chart-2 text-white shadow-md h-fit flex flex-col text-xl items-center font-medium p-3 w-full">
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
          <Button className="bg-chart-5 text-white shadow-md h-fit flex flex-col text-xl items-center font-medium p-3 w-full">
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
