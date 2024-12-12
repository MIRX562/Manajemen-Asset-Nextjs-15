import {
  getActiveCheckInOuts,
  getCheckoutMetrics,
} from "@/actions/checkinout-actions";
import { DataTable } from "@/components/table/data-table";
import React from "react";
import { activeCheckoutsColumns } from "./_components/collumn";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import CheckoutForm from "./_components/form-checkout";
import { getAvailableAssets } from "@/actions/assets-actions";
import { getAllEMployeesDropdown } from "@/actions/employee-actions";
import CheckoutMetrics from "./_components/metrics";

export default async function page() {
  const data = await getActiveCheckInOuts();
  const assets = await getAvailableAssets();
  const employees = await getAllEMployeesDropdown();
  const metrics = await getCheckoutMetrics();
  return (
    <div className="flex flex-col w-full pt-4 space-y-4">
      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Check Out Asset</CardTitle>
            <CardDescription>
              Checkout available asset to employee
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CheckoutForm assets={assets} employees={employees} />
          </CardContent>
        </Card>
        <CheckoutMetrics />
      </div>
      <h1 className="text-3xl font-bold">Active Checkouts</h1>
      <DataTable data={data} columns={activeCheckoutsColumns} />
    </div>
  );
}
