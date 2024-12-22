import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import prisma from "@/lib/db";

type LocationCounts = Record<string, number>;

async function fetchLocationCounts(): Promise<LocationCounts> {
  const counts = await prisma.location.groupBy({
    by: ["type"],
    _count: {
      id: true,
    },
  });

  const formattedCounts = counts.reduce((acc, curr) => {
    acc[curr.type] = curr._count.id;
    return acc;
  }, {} as LocationCounts);

  return formattedCounts;
}

export default async function LocationHeader() {
  const locationCounts = await fetchLocationCounts();

  return (
    <div className="grid gap-4 md:grid-cols-3 w-full">
      {Object.entries(locationCounts).map(([type, count]) => (
        <Card key={type}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{type}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{count}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
