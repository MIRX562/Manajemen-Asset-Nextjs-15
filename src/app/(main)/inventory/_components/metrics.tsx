import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, AlertTriangle, DollarSign, Tags } from "lucide-react";

export default function InventoryMetrics() {
  // In a real application, these values would be fetched from an API
  const metrics = [
    {
      title: "Total Inventory Items",
      value: 1234,
      icon: Package,
      color: "text-blue-500",
    },
    {
      title: "Low Stock Alerts",
      value: 23,
      icon: AlertTriangle,
      color: "text-yellow-500",
    },
    {
      title: "Total Inventory Value",
      value: "$123,456",
      icon: DollarSign,
      color: "text-green-500",
    },
    { title: "Categories", value: 15, icon: Tags, color: "text-purple-500" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
      {metrics.map((metric) => (
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
