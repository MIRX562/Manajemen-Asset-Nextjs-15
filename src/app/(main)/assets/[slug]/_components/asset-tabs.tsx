import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MapPinIcon, Wrench, TruckIcon, ClockIcon } from "lucide-react";
import { AssetLocationHistory, CheckInOut, Maintenance } from "@prisma/client";

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("id", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

interface AssetTabsProps {
  assetData: any;
}

export default function AssetTabs({ assetData }: AssetTabsProps) {
  return (
    <Tabs defaultValue="location" className="space-y-4 flex flex-col w-full">
      <TabsList className="mx-auto">
        <TabsTrigger value="location">Locations</TabsTrigger>
        <TabsTrigger value="maintenance">Maintenances</TabsTrigger>
        <TabsTrigger value="checkinout">CheckOuts</TabsTrigger>
        <TabsTrigger value="lifecycle">Lifecycles</TabsTrigger>
      </TabsList>

      {/* Location Tab */}
      <TabsContent value="location">
        <Card>
          <CardHeader>
            <CardTitle>Location History</CardTitle>
            <CardDescription>
              Track where this asset has been located
            </CardDescription>
          </CardHeader>
          <CardContent>
            {assetData.locationHistory &&
            assetData.locationHistory.length > 0 ? (
              <ul className="space-y-4">
                {assetData.locationHistory.map(
                  (location: AssetLocationHistory) => (
                    <li
                      key={location.id}
                      className="flex items-center space-x-4"
                    >
                      <MapPinIcon className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{location.location.name}</p>
                        <p className="text-sm text-muted-foreground">
                          From: {formatDate(location.assigned_date)}
                          {location.release_date
                            ? ` To: ${formatDate(location.release_date)}`
                            : " (Current)"}
                        </p>
                      </div>
                    </li>
                  )
                )}
              </ul>
            ) : (
              <p>No location history available.</p>
            )}
          </CardContent>
        </Card>
      </TabsContent>

      {/* Maintenance Tab */}
      <TabsContent value="maintenance">
        <Card>
          <CardHeader>
            <CardTitle>Maintenance History</CardTitle>
            <CardDescription>
              Record of all maintenance activities
            </CardDescription>
          </CardHeader>
          <CardContent>
            {assetData.maintenances && assetData.maintenances.length > 0 ? (
              <ul className="space-y-4">
                {assetData.maintenances.map((maintenance) => (
                  <li
                    key={maintenance.id}
                    className="flex items-center space-x-4"
                  >
                    <Wrench className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{maintenance.status}</p>
                      <p className="text-sm text-muted-foreground">
                        Date: {formatDate(maintenance.scheduled_date)}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No maintenance records available.</p>
            )}
          </CardContent>
        </Card>
      </TabsContent>

      {/* Check In/Out Tab */}
      <TabsContent value="checkinout">
        <Card>
          <CardHeader>
            <CardTitle>Check In/Out History</CardTitle>
            <CardDescription>
              Record of asset check-ins and check-outs
            </CardDescription>
          </CardHeader>
          <CardContent>
            {assetData.checkInOuts && assetData.checkInOuts.length > 0 ? (
              <ul className="space-y-4">
                {assetData.checkInOuts.map((checkInOut) => (
                  <li
                    key={checkInOut.id}
                    className="flex items-center space-x-4"
                  >
                    <TruckIcon className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">
                        {checkInOut.status === "DIPINJAM"
                          ? "Checked Out"
                          : "Checked In"}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Checked-out by: {checkInOut.user.username}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Checked-out to: {checkInOut.employee.name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {" "}
                        From: {formatDate(checkInOut.updated_at)}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No check-in/out records available.</p>
            )}
          </CardContent>
        </Card>
      </TabsContent>

      {/* Lifecycle Tab */}
      <TabsContent value="lifecycle">
        <Card>
          <CardHeader>
            <CardTitle>Asset Lifecycle</CardTitle>
            <CardDescription>
              Stages in the asset&apos;s lifecycle
            </CardDescription>
          </CardHeader>
          <CardContent>
            {assetData.assetLifecycles &&
            assetData.assetLifecycles.length > 0 ? (
              <ul className="space-y-4">
                {assetData.assetLifecycles.map((lifecycle) => (
                  <li
                    key={lifecycle.id}
                    className="flex items-center space-x-4"
                  >
                    <ClockIcon className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{lifecycle.stage}</p>
                      <p className="text-sm text-muted-foreground">
                        From: {formatDate(lifecycle.change_date)}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Note: {lifecycle.notes}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No lifecycle records available.</p>
            )}
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
