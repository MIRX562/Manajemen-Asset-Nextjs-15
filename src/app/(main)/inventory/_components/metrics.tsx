import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, AlertTriangle, DollarSign, Tags } from "lucide-react";
import { getInventoryMetrics } from "@/actions/analytics-actions";

export default async function InventoryMetrics() {
  const metrics = await getInventoryMetrics();

  const metricData = [
    {
      title: "Total Inventory Items",
      value: metrics.totalItems,
      icon: Package,
      color: "text-chart-2",
    },
    {
      title: "Low Stock Alerts",
      value: metrics.lowStockAlerts,
      icon: AlertTriangle,
      color: "text-destructive",
    },
    {
      title: "Total Inventory Value",
      value: `Rp.${metrics.totalValue.toLocaleString()}`,
      icon: DollarSign,
      color: "text-chart-3",
    },
    {
      title: "Categories",
      value: metrics.categories,
      icon: Tags,
      color: "text-chart-4",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
      {metricData.map((metric) => (
        <Card key={metric.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {metric.title}
            </CardTitle>
            <metric.icon className={`h-4 w-4 ${metric.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metric.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
