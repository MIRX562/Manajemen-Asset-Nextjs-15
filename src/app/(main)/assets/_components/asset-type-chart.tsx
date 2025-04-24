"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

type AssetTypeChartProps = {
  data: { name: string; value: number; fill: string }[];
};

export function AssetTypeChart({ data }: AssetTypeChartProps) {
  return (
    <Card className="col-span-full md:col-span-5">
      <CardHeader>
        <CardTitle>Asset Type Distribution</CardTitle>
        <CardDescription>
          This chart shows the distribution of assets across different
          categories.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="40%"
              cy="50%"
              outerRadius={80}
              innerRadius={60}
              label={({ name, percent }) =>
                `${name} ${(percent * 100).toFixed(0)}%`
              }
              labelLine={true}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="rounded-lg border bg-background p-2 shadow-sm">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-sm font-bold">
                          {payload[0].payload.name}
                        </span>
                        <span className="text-xs">
                          {payload[0].value} assets
                        </span>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
