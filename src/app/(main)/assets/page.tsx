import { getAllAssets } from "@/actions/assets-actions";
import { DataTable } from "@/components/table/data-table";
import React from "react";
import { assetColumns } from "./_components/collumn";
import InsertDataDialog from "@/components/table/insertDataButton";
import AddAssetForm from "./_components/form-add";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import AssetMetrics from "./_components/asset-metric";
import {
  getAssetValuationOverYear,
  getAssetTypeDistribution,
} from "@/actions/analytics-actions";
import { PortfolioChart } from "../dashboard/_components/portfolio-charts";
import { AssetTypeChart } from "./_components/asset-type-chart";

export const dynamic = "force-dynamic";

export default async function AssetsPage() {
  const data = await getAllAssets();
  const chartData = await getAssetValuationOverYear();
  const assetTypeData = await getAssetTypeDistribution();

  return (
    <div className="flex flex-col w-full py-4 gap-4">
      <div className="w-full flex flex-col md:flex-row gap-2">
        <h1 className="text-3xl font-bold">Asset Management Overview</h1>
        <div className="flex justify-center items-center ml-auto gap-2">
          <Button size="sm" className="gap-2 h-8" asChild>
            <Link href="/assets/checkin">Check-In Asset</Link>
          </Button>
          <Button size="sm" className="gap-2 h-8" asChild>
            <Link href="/assets/checkout">Check-Out Asset</Link>
          </Button>
          <InsertDataDialog triggerButtonText="Add Asset">
            <AddAssetForm />
          </InsertDataDialog>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <AssetMetrics />
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          <PortfolioChart data={chartData} />
          <AssetTypeChart data={assetTypeData} />
        </div>
      </div>

      <div className="space-y-2 pb-4">
        <h1 className="text-2xl font-bold">All Assets</h1>
        <DataTable columns={assetColumns} data={data} />
      </div>
    </div>
  );
}
