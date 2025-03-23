import { getDashboardSummary } from "@/actions/analytics-actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, Wrench, Users, AlertCircle } from "lucide-react";

interface Metric {
  title: string;
  value: number | string;
  change: string;
  icon: keyof typeof icons;
  color: string;
}

const icons = { Package, Wrench, AlertCircle, Users };

export async function Metrics() {
  const data = await getDashboardSummary(); // Fetch data using the server action

  const metrics: Metric[] = [
    {
      title: "Total Assets",
      value: data.totalAssets,
      change: `${data.utilizationRate.toFixed(2)}% utilization rate`,
      icon: "Package",
      color: "text-chart-1",
    },
    {
      title: "Assets Checked Out",
      value: data.checkoutCount,
      change: `${((data.checkoutCount / data.totalAssets) * 100).toFixed(
        1
      )}% of total assets`,
      icon: "Users",
      color: "text-chart-2",
    },
    {
      title: "Assets in Maintenance",
      value: data.pendingMaintenance,
      change: `${((data.pendingMaintenance / data.totalAssets) * 100).toFixed(
        1
      )}% of total assets`,
      icon: "Wrench",
      color: "text-chart-3",
    },
    {
      title: "Low Stock Items",
      value: data.lowStockCount,
      change:
        data.lowStockCount > 0
          ? "Requires immediate attention"
          : "All stock levels are sufficient",
      icon: "AlertCircle",
      color: "text-chart-4",
    },
  ];

  return (
    <div className="grid gap-4 grid-cols-2 lg:grid-cols-4 mt-4">
      {metrics.map((metric, index) => {
        const Icon = icons[metric.icon];
        return (
          <Card key={index} className="col-span-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-sm font-medium">
                {metric.title}
              </CardTitle>
              <Icon className={`h-4 w-4 ${metric.color}`} />
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-3xl font-bold">{metric.value}</div>
              <p className="text-xs text-muted-foreground">{metric.change}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
