import { Metrics } from "@/app/(main)/dashboard/_components/metrics";
import { QuickActions } from "@/app/(main)/dashboard/_components/quick-action";
import { RecentActivitiesTable } from "@/app/(main)/dashboard/_components/recent-activities";
import { UpcomingMaintenanceTable } from "@/app/(main)/dashboard/_components/upcoming-maintenance";
import { PortfolioChart } from "./_components/portfolio-charts";
import { getAssetValuationOverYear } from "@/actions/analytics-actions";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const chartData = await getAssetValuationOverYear();
  return (
    <div className="p-2 space-y-4">
      <Metrics />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <PortfolioChart data={chartData} />
        <QuickActions />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <RecentActivitiesTable />
        <UpcomingMaintenanceTable />
      </div>
    </div>
  );
}
