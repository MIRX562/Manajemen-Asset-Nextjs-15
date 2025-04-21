"use client";

import {
  Bar,
  BarChart,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

interface AssetLifecycleChartProps {
  data: {
    name: string;
    value: number;
    fill: string;
  }[];
}

export function AssetLifecycleChart({ data }: AssetLifecycleChartProps) {
  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>Asset Lifecycle</CardTitle>
        <CardDescription>
          Distribution of assets across different lifecycle stages.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={data}
            margin={{ left: 16, right: 16, top: 16, bottom: 16 }}
          >
            <XAxis dataKey="name" />
            <YAxis />
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
            <Bar dataKey="value" radius={[4, 4, 0, 0]}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
