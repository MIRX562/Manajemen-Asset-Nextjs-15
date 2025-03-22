import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  CalendarClock,
  AlertTriangle,
  Users,
  Package,
  CalendarDays,
} from "lucide-react";

const metricIcons = {
  totalScheduledMaintenance: CalendarClock,
  overdueMaintenance: AlertTriangle,
  uniqueMechanics: Users,
  uniqueAssets: Package,
  maintenanceThisWeek: CalendarDays,
};

export default function MaintenanceMetrics({ metrics }: { metrics: any }) {
  const metricData = [
    {
      key: "totalScheduledMaintenance",
      title: "Scheduled Maintenance",
      color: "text-chart-1",
    },
    {
      key: "overdueMaintenance",
      title: "Overdue Maintenance",
      color: "text-chart-2",
    },
    {
      key: "uniqueMechanics",
      title: "Mechanics Assigned",
      color: "text-chart-3",
    },
    { key: "uniqueAssets", title: "Assets Scheduled", color: "text-chart-4" },
    {
      key: "maintenanceThisWeek",
      title: "Maintenance This Week",
      color: "text-chart-5",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 w-full">
      {metricData.map(({ key, title, color }) => {
        const Icon = metricIcons[key];
        return (
          <Card key={key} className="flex flex-col justify-between p-4">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base font-medium">{title}</CardTitle>
              <Icon className={`h-6 w-6 ${color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-4xl md:text-5xl font-bold">
                {metrics[key]}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
