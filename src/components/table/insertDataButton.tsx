"use client";

import { ReactNode, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PlusCircle } from "lucide-react";

type ReusableFormDialogProps = {
  triggerButtonText: string;
  children: ReactNode;
};

export default function InsertDataDialog({
  triggerButtonText,
  children,
}: ReusableFormDialogProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="gap-2 h-8 shadow-md">
          <PlusCircle className="h-4 w-4" />
          {triggerButtonText}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>{triggerButtonText}</DialogTitle>
        <div className="max-h-[80svh] overflow-y-scroll">{children}</div>
      </DialogContent>
    </Dialog>
  );
}
