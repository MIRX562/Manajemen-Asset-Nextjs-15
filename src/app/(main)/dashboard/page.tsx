import { Metrics } from "@/app/(main)/dashboard/_components/metrics";
import { RecentActivitiesTable } from "@/app/(main)/dashboard/_components/recent-activities";
import { UpcomingMaintenanceTable } from "@/app/(main)/dashboard/_components/upcoming-maintenance";
import OnlineUsers from "../assets/_components/active-users";
import { AssetLifecycleChart } from "./_components/asset-lifecycle-chart";
import { getAssetLifecycleData } from "@/actions/analytics-actions";
import { AssetStatusChart } from "./_components/asset-status-chart";
import { getAssetStatusData } from "@/actions/analytics-actions";
import { AssetLocationChart } from "./_components/asset-location-chart";
import { getAssetLocationData } from "@/actions/analytics-actions";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const lifecycleData = await getAssetLifecycleData();
  const assetStatusData = await getAssetStatusData();
  const assetLocationData = await getAssetLocationData();

  return (
    <div className="p-2 space-y-4">
      <Metrics />

      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        <AssetStatusChart
          data={assetStatusData}
          title="Asset Status Overview"
          description="Distribution of assets by their current status."
        />
        <AssetLocationChart
          data={assetLocationData}
          title="Asset Location Overview"
          description="Distribution of assets by their current location."
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <OnlineUsers />
        <AssetLifecycleChart data={lifecycleData} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        <RecentActivitiesTable />
        <UpcomingMaintenanceTable />
      </div>
    </div>
  );
}
