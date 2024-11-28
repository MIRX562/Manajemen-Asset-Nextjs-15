"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  CalendarIcon,
  LifeBuoyIcon,
  DollarSignIcon,
  TagIcon,
} from "lucide-react";
import { calculateCurrentValue } from "@/lib/utils";

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("id", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("id", {
    style: "currency",
    currency: "IDR",
  }).format(amount);
};

interface AssetOverviewProps {
  assetData: any;
}

export default function AssetOverview({ assetData }: AssetOverviewProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Asset Type</CardTitle>
          <TagIcon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{assetData.type.model}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Status</CardTitle>
          <LifeBuoyIcon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <Badge
            variant={assetData.status === "IN_USE" ? "default" : "secondary"}
          >
            {assetData.status}
          </Badge>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Purchase Date</CardTitle>
          <CalendarIcon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {formatDate(assetData.purchase_date)}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Initial Value</CardTitle>
          <DollarSignIcon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {formatCurrency(assetData.initial_value)}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Salvage Value</CardTitle>
          <DollarSignIcon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {formatCurrency(assetData.salvage_value)}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Current Value</CardTitle>
          <DollarSignIcon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {formatCurrency(
              calculateCurrentValue(
                assetData.initial_value,
                assetData.salvage_value,
                assetData.useful_life,
                assetData.purchase_date
              )
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
