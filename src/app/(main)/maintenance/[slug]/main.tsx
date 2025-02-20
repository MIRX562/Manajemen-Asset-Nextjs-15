"use client";

import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  InfoIcon,
  WrenchIcon,
  BoxIcon,
  UserIcon,
  ClockIcon,
  NotebookText,
} from "lucide-react";
import { Inventory, MaintenanceStatus } from "@prisma/client";
import Link from "next/link";
import UpdateMaintenaceForm from "./_components/form-update";

interface Maintenance {
  id: number;
  asset: {
    name: string;
    status: string;
    type_id: number;
    purchase_date: string;
    lifecycle_stage: string;
    initial_value: number;
    salvage_value: number;
  };
  mechanic: {
    username: string;
    role: string;
    email: string;
  };
  scheduled_date: string;
  status: MaintenanceStatus;
  notes: string;
  inventoryItems: Array<{
    inventory_id: number;
    quantity_used: number;
    inventory: Inventory;
  }>;
  created_at: string;
  updated_at: string;
}

export default function MaintenanceDetailView({
  maintenance,
}: {
  maintenance: Maintenance;
}) {
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "PPP");
  };

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

  return (
    <div className="px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <Button asChild variant="outline" className="flex items-center">
          <Link href="/maintenance">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to List
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

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="col-span-full lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center">
              <WrenchIcon className="mr-2 h-5 w-5" />
              Basic Maintenance Details
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div>
              <Label>Maintenance ID</Label>
              <p>{maintenance.id}</p>
            </div>
            <div>
              <Label>Asset Name</Label>
              <p>{maintenance.asset.name}</p>
            </div>
            <div>
              <Label>Asset Status</Label>
              <p>{maintenance.asset.status}</p>
            </div>
            <div>
              <Label>Mechanic Name</Label>
              <p>{maintenance.mechanic.username}</p>
            </div>
            <div>
              <Label>Mechanic Role</Label>
              <p>{maintenance.mechanic.role}</p>
            </div>
            <div>
              <Label>Scheduled Date</Label>
              <p>{formatDate(maintenance.scheduled_date)}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <ClockIcon className="mr-2 h-5 w-5" />
              Timestamps
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <div>
              <Label>Created At</Label>
              <p>{formatDate(maintenance.created_at)}</p>
            </div>
            <div>
              <Label>Updated At</Label>
              <p>{formatDate(maintenance.updated_at)}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BoxIcon className="mr-2 h-5 w-5" />
              Asset Information
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <div>
              <Label>Asset Name</Label>
              <p>{maintenance.asset.name}</p>
            </div>
            <div>
              <Label>Asset Type ID</Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center">
                      <p className="text-gray-700 mr-2">
                        {maintenance.asset.type_id}
                      </p>
                      <InfoIcon className="h-4 w-4 text-gray-400" />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Unique identifier for the asset type</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <div>
              <Label>Purchase Date</Label>
              <p>{formatDate(maintenance.asset.purchase_date)}</p>
            </div>
            <div>
              <Label>Lifecycle Stage</Label>
              <p>{maintenance.asset.lifecycle_stage}</p>
            </div>
            <div>
              <Label>Initial Value</Label>
              <p>${maintenance.asset.initial_value.toLocaleString()}</p>
            </div>
            <div>
              <Label>Salvage Value</Label>
              <p>${maintenance.asset.salvage_value.toLocaleString()}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <UserIcon className="mr-2 h-5 w-5" />
              Mechanic Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Username</Label>
              <p>{maintenance.mechanic.username}</p>
            </div>
            <div>
              <Label>Role</Label>
              <p>{maintenance.mechanic.role}</p>
            </div>
            <div>
              <Label>Email</Label>
              <p>{maintenance.mechanic.email}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BoxIcon className="mr-2 h-5 w-5" />
              Inventory Items Used
            </CardTitle>
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
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
