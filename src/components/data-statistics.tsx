import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Statistic = {
  title: string;
  value: string | number;
  description?: string;
};

type DataStatisticProps = {
  statistics: [Statistic, Statistic, Statistic];
  children: React.ReactNode;
};

export default function DataStatistic({
  statistics,
  children,
}: DataStatisticProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {statistics.map((stat, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            {stat.description && (
              <p className="text-xs text-muted-foreground">
                {stat.description}
              </p>
            )}
          </CardContent>
        </Card>
      ))}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">{children}</CardContent>
      </Card>
    </div>
  );
}
