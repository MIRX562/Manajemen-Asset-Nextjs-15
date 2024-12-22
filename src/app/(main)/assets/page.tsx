import { getAllAssets } from "@/actions/assets-actions";
import { DataTable } from "@/components/table/data-table";
import React from "react";
import { assetColumns } from "./_components/collumn";
import InsertDataDialog from "@/components/table/insertDataButton";
import AddAssetForm from "./_components/form-add";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { AssetStatusChart } from "../assets/_components/asset-status-chart";
import { RecentCheckouts } from "../assets/_components/recent-checkouts";
import AssetStats from "./_components/metrics";

export const dynamic = "force-dynamic";

export default async function AssetsPage() {
  const data = await getAllAssets();
  return (
    <div className="flex flex-col w-full h-full py-4 gap-4">
      <div className="w-full flex flex-col md:flex-row gap-2">
        <h1 className="text-3xl font-bold">Asset Management Overview</h1>
        <div className="flex justify-center items-center ml-auto gap-2">
          <Button size="sm" className="gap-2 h-8" asChild>
            <Link href="/assets/checkin">Check-In Asset</Link>
          </Button>
          <Button size="sm" className="gap-2 h-8" asChild>
            <Link href="/checkout">Check-Out Asset</Link>
          </Button>
          <InsertDataDialog triggerButtonText="Add Asset">
            <AddAssetForm />
          </InsertDataDialog>
        </div>
      </div>

      <AssetStats />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Asset Status Summary</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <AssetStatusChart />
          </CardContent>
        </Card>
        <Card className="col-span-3 ">
          <CardHeader>
            <CardTitle>Recent Check-Outs</CardTitle>
            <CardDescription>
              Latest assets checked out from the system
            </CardDescription>
          </CardHeader>
          <CardContent className="max-h-[300px] overflow-auto">
            <RecentCheckouts />
          </CardContent>
        </Card>
      </div>

      <div className="space-y-2 pb-4">
        <h1 className="text-2xl font-bold">All Assets</h1>
        <DataTable columns={assetColumns} data={data} />
      </div>
    </div>
  );
}
