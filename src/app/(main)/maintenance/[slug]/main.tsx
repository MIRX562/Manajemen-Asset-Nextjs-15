"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  WrenchIcon,
  BoxIcon,
  NotebookText,
  Edit,
} from "lucide-react";
import { MaintenanceStatus } from "@prisma/client";
import Link from "next/link";
import UpdateMaintenaceForm from "./_components/form-update";
import { formatDate } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  EditAssetMechanicForm,
  EditInventoryForm,
} from "./_components/form-change";

interface Maintenance {
  id: number;
  asset: {
    id: number;
    name: string;
    status: string;
    type: {
      model: string;
    };
  };
  mechanic: {
    id: number;
    username: string;
    email: string;
  };
  scheduled_date: Date;
  status: MaintenanceStatus;
  notes: string | null;
  inventoryItems: Array<{
    inventory_id: number;
    quantity_used: number;
    inventory: {
      name: string;
    };
  }>;
  created_at: Date;
  updated_at: Date;
}

type FormProps = {
  inventoryItems: {
    id: number;
    name: string;
    quantity: number;
  }[];
  assets: {
    id: number;
    name: string;
  }[];
};

export default function MaintenanceDetailView({
  maintenance,
  data,
}: {
  maintenance: Maintenance;
  data: FormProps;
}) {
  const getStatusColor = (status: MaintenanceStatus) => {
    switch (status) {
      case MaintenanceStatus.DIJADWALKAN:
        return "bg-blue-100 text-blue-800";
      case MaintenanceStatus.TERTUNDA:
        return "bg-yellow-100 text-yellow-800";
      case MaintenanceStatus.SELESAI:
        return "bg-green-100 text-green-800";
      //   case "cancelled":
      //     return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const initialAssetMechanic = {
    id: maintenance.id,
    asset_id: maintenance.asset.id,
    mechanic_id: maintenance.mechanic.id,
  };

  const initialInventory = {
    id: maintenance.id,
    inventory: maintenance.inventoryItems,
  };

  return (
    <div className="px-2 py-4 space-y-4">
      <div className="flex items-center gap-4">
        <Button
          asChild
          variant="default"
          size="icon"
          className="flex items-center shadow-md"
        >
          <Link href="/maintenance">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">Maintenance Details</h1>
        <Badge
          className={`text-lg font-semibold ${getStatusColor(
            maintenance.status
          )}`}
        >
          {maintenance.status}
        </Badge>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="col-span-2 ">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center">
              <WrenchIcon className="mr-2 h-5 w-5" />
              Maintenance Details
            </CardTitle>
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  size="icon"
                  className={`${
                    maintenance.status == MaintenanceStatus.SELESAI
                      ? "hidden"
                      : ""
                  }`}
                >
                  <Edit className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogTitle>Edit maintenance</DialogTitle>
                <div className="max-h-[80svh] overflow-y-scroll">
                  <EditAssetMechanicForm
                    assets={data.assets}
                    initialData={initialAssetMechanic}
                  />
                </div>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {/* Basic Maintenance Info */}
            <div>
              <Label>Maintenance ID</Label>
              <p className="text-muted-foreground">{maintenance.id}</p>
            </div>
            <div>
              <Label>Asset Name</Label>
              <p className="text-muted-foreground">{maintenance.asset.name}</p>
            </div>
            <div>
              <Label>Asset Status</Label>
              <p className="text-muted-foreground">
                {maintenance.asset.status}
              </p>
            </div>
            <div>
              <Label>Asset Type</Label>
              <p className="text-muted-foreground">
                {maintenance.asset.type.model}
              </p>
            </div>

            <div>
              <Label>Mechanic Name</Label>
              <p className="text-muted-foreground">
                {maintenance.mechanic.username}
              </p>
            </div>
            <div>
              <Label>Mechanic Email</Label>
              <p className="text-muted-foreground">
                {maintenance.mechanic.email}
              </p>
            </div>

            <div>
              <Label>Scheduled Date</Label>
              <p className="text-muted-foreground">
                {formatDate(maintenance.scheduled_date.toLocaleString())}
              </p>
            </div>

            <div>
              <Label>Created At</Label>
              <p className="text-muted-foreground">
                {formatDate(maintenance.created_at.toLocaleString())}
              </p>
            </div>
            <div>
              <Label>Updated At</Label>
              <p className="text-muted-foreground">
                {formatDate(maintenance.updated_at.toLocaleString())}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center">
              <BoxIcon className="mr-2 h-5 w-5" />
              Inventory Items Used
            </CardTitle>
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  size="icon"
                  className={`${
                    maintenance.status == MaintenanceStatus.SELESAI
                      ? "hidden"
                      : ""
                  }`}
                >
                  <Edit className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogTitle>Edit maintenance</DialogTitle>
                <div className="max-h-[80svh] overflow-y-scroll">
                  <EditInventoryForm
                    initialData={initialInventory}
                    inventoryItems={data.inventoryItems}
                  />
                </div>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {maintenance.inventoryItems.map((item) => (
                <li key={item.inventory_id} className="flex justify-between">
                  <span>{item.inventory.name}</span>
                  <span>Quantity: {item.quantity_used}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className="col-span-full">
          <CardHeader>
            <CardTitle className="flex items-center">
              <NotebookText className="mr-2 h-5 w-5" />
              Maintenace Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <UpdateMaintenaceForm
              maintenance_status={maintenance.status}
              notes={maintenance.notes}
              id={maintenance.id}
              asset_id={maintenance.asset.id}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
