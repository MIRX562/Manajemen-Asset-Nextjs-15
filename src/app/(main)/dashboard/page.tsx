import { Metrics } from "@/app/(main)/dashboard/_components/metrics";
import { QuickActions } from "@/app/(main)/dashboard/_components/quick-action";
import { RecentActivitiesTable } from "@/app/(main)/dashboard/_components/recent-activities";
import { UpcomingMaintenanceTable } from "@/app/(main)/dashboard/_components/upcoming-maintenance";

export default async function DashboardPage() {
  return (
    <div className="container mx-auto p-2">
      <Metrics />
      <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">
        <QuickActions />
        <QuickActions />
        <RecentActivitiesTable />
        <UpcomingMaintenanceTable />
      </div>
    </div>
  );
}
