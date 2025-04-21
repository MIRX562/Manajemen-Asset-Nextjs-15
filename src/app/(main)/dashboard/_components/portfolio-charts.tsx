"use client";

import * as React from "react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { formatCurrency } from "@/lib/utils";

const chartConfig = {
  views: {
    label: "Total value",
  },
  highest: {
    label: "Highest",
    color: "hsl(var(--chart-1))",
  },
  lowest: {
    label: "Lowest",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

export function PortfolioChart({
  data,
}: {
  data: { month: string; totalValue: number }[];
}) {
  // Calculate highest and lowest
  const highest = React.useMemo(
    () =>
      data.reduce(
        (max, curr) => (curr.totalValue > max ? curr.totalValue : max),
        0
      ),
    [data]
  );

  const lowest = React.useMemo(
    () =>
      data.reduce(
        (min, curr) => (curr.totalValue < min ? curr.totalValue : min),
        Infinity
      ),
    [data]
  );

  return (
    <Card className="col-span-full md:col-span-7">
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
          <CardTitle>Asset Valuation</CardTitle>
          <CardDescription>
            Showing total asset valuation for the last year.
          </CardDescription>
        </div>
        <div className="flex">
          <div className="relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left sm:border-l sm:border-t-0 sm:px-8 sm:py-6">
            <span className="text-lg text-muted-foreground">
              {chartConfig.highest.label}
            </span>
            <span className="text-lg font-bold leading-none">
              {formatCurrency(highest)}
            </span>
          </div>
          <div className="relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left sm:border-l sm:border-t-0 sm:px-8 sm:py-6">
            <span className="text-lg text-muted-foreground">
              {chartConfig.lowest.label}
            </span>
            <span className="text-lg font-bold leading-none">
              {formatCurrency(lowest)}
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <BarChart
            accessibilityLayer
            data={data}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString("id", {
                  month: "short",
                });
              }}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[150px]"
                  nameKey="views"
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("id", {
                      month: "short",
                      year: "numeric",
                    });
                  }}
                />
              }
            />
            <Bar dataKey="totalValue" fill={`var(--color-highest)`} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
