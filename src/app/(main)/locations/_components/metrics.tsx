import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import prisma from "@/lib/db";
import { Warehouse, Building, Server } from "lucide-react";

type LocationCounts = Record<string, number>;

async function fetchLocationCounts(): Promise<LocationCounts> {
  const counts = await prisma.location.groupBy({
    by: ["type"],
    _count: {
      id: true,
    },
  });

  return counts.reduce((acc, curr) => {
    acc[curr.type] = curr._count.id;
    return acc;
  }, {} as LocationCounts);
}

const locationIcons: Record<string, React.ElementType> = {
  GUDANG: Warehouse,
  KANTOR: Building,
  DATA_CENTER: Server,
};

export default async function LocationHeader() {
  const locationCounts = await fetchLocationCounts();

  return (
    <div className="grid gap-4 md:grid-cols-3 w-full">
      {Object.entries(locationCounts).map(([type, count]) => {
        const Icon = locationIcons[type] || Building; // Default icon if unknown type
        return (
          <Card key={type}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{type}</CardTitle>
              <Icon className="h-6 w-6 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{count}</div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
