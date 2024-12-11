import { getAllAssets } from "@/actions/assets-actions";
import { DataTable } from "@/components/table/data-table";
import React from "react";
import { assetColumns } from "./_components/collumn";
import InsertDataDialog from "@/components/table/insertDataButton";
import AddAssetForm from "./_components/form-add";
import { getAllAssetTypes } from "@/actions/asset-type-actions";
import Link from "next/link";
import { BarChart, CheckCircle, Clock, Package } from "lucide-react";

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
import { TopAssets } from "../assets/_components/top-assets";
import { TopUsers } from "../assets/_components/top-users";

export default async function AssetsPage() {
  const data = await getAllAssets();
  const assetType = await getAllAssetTypes();
  return (
    <div className="flex flex-col w-full h-full py-4 gap-4">
      <div className="w-full flex flex-col md:flex-row gap-2">
        <h1 className="text-3xl font-bold">Asset Management Overview</h1>
        <div className="flex justify-center items-center ml-auto gap-2">
          <Button size="sm" className="gap-2 h-8" asChild>
            <Link href="/check-in">Check-In Asset</Link>
          </Button>
          <Button size="sm" className="gap-2 h-8" asChild>
            <Link href="/check-out">Check-Out Asset</Link>
          </Button>
          <InsertDataDialog triggerButtonText="Add Asset">
            <AddAssetForm assetType={assetType} />
          </InsertDataDialog>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 w-full">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Assets</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,234</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Checked-Out Assets
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">345</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Returned Assets
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">889</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Overdue Returns
            </CardTitle>
            <BarChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Asset Status Summary</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <AssetStatusChart />
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Recent Check-Outs</CardTitle>
            <CardDescription>
              Latest assets checked out from the system
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RecentCheckouts />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Top Assets</CardTitle>
            <CardDescription>
              Most frequently checked-out assets
            </CardDescription>
          </CardHeader>
          <CardContent>
            <TopAssets />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Top Users</CardTitle>
            <CardDescription>Most active users in the system</CardDescription>
          </CardHeader>
          <CardContent>
            <TopUsers />
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
