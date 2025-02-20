import {
  getActiveCheckInOuts,
  getAllActiveCheckoutsForm,
} from "@/actions/checkinout-actions";
import { DataTable } from "@/components/table/data-table";
import React from "react";
import { activeCheckoutsColumns } from "../checkout/_components/collumn";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { DialogTitle } from "@radix-ui/react-dialog";
import CheckInForm from "./_component/form-checkin";

export default async function Page() {
  const data = await getActiveCheckInOuts();
  const assets = await getAllActiveCheckoutsForm();
  return (
    <div className="flex flex-col w-full pt-4 space-y-4">
      <div className="flex w-full items-center justify-between">
        <h1 className="text-3xl font-bold">Active Checkouts</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button>Checkin Asset</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogTitle>Checkin Asset</DialogTitle>
            <CheckInForm data={assets} />
          </DialogContent>
        </Dialog>
      </div>
      <DataTable data={data} columns={activeCheckoutsColumns} />
    </div>
  );
}
