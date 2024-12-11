"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  CalendarIcon,
  ArrowLeft,
  InfoIcon,
  WrenchIcon,
  BoxIcon,
  UserIcon,
  ClockIcon,
} from "lucide-react";
import { Inventory, MaintenanceStatus } from "@prisma/client";
import Link from "next/link";

interface Maintenance {
  id: string;
  asset: {
    name: string;
    status: string;
    type_id: string;
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
    inventory_id: string;
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
  const [notes, setNotes] = useState(maintenance.notes);
  const [status, setStatus] = useState(maintenance.status);
  const [scheduledDate, setScheduledDate] = useState(
    maintenance.scheduled_date
  );

  const handleNotesChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNotes(event.target.value);
  };

  const handleStatusChange = (value: string) => {
    setStatus(value);
  };

  const handleReschedule = (newDate: string) => {
    setScheduledDate(newDate);
  };

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
        <Badge className={`text-lg font-semibold ${getStatusColor(status)}`}>
          {status}
        </Badge>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="col-span-full">
          <CardHeader>
            <CardTitle className="flex items-center">
              <WrenchIcon className="mr-2 h-5 w-5" />
              Basic Maintenance Details
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div>
              <Label>Maintenance ID</Label>
              <p className="text-gray-700">{maintenance.id}</p>
            </div>
            <div>
              <Label>Asset Name</Label>
              <p className="text-gray-700">{maintenance.asset.name}</p>
            </div>
            <div>
              <Label>Asset Status</Label>
              <p className="text-gray-700">{maintenance.asset.status}</p>
            </div>
            <div>
              <Label>Mechanic Name</Label>
              <p className="text-gray-700">{maintenance.mechanic.username}</p>
            </div>
            <div>
              <Label>Mechanic Role</Label>
              <p className="text-gray-700">{maintenance.mechanic.role}</p>
            </div>
            <div>
              <Label>Scheduled Date</Label>
              <p className="text-gray-700">{formatDate(scheduledDate)}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-full md:col-span-1 lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center">
              <BoxIcon className="mr-2 h-5 w-5" />
              Asset Information
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <div>
              <Label>Asset Name</Label>
              <p className="text-gray-700">{maintenance.asset.name}</p>
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
              <p className="text-gray-700">
                {formatDate(maintenance.asset.purchase_date)}
              </p>
            </div>
            <div>
              <Label>Lifecycle Stage</Label>
              <p className="text-gray-700">
                {maintenance.asset.lifecycle_stage}
              </p>
            </div>
            <div>
              <Label>Initial Value</Label>
              <p className="text-gray-700">
                ${maintenance.asset.initial_value.toLocaleString()}
              </p>
            </div>
            <div>
              <Label>Salvage Value</Label>
              <p className="text-gray-700">
                ${maintenance.asset.salvage_value.toLocaleString()}
              </p>
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
              <p className="text-gray-700">{maintenance.mechanic.username}</p>
            </div>
            <div>
              <Label>Role</Label>
              <p className="text-gray-700">{maintenance.mechanic.role}</p>
            </div>
            <div>
              <Label>Email</Label>
              <p className="text-gray-700">{maintenance.mechanic.email}</p>
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

        <Card className="col-span-full md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center">
              <ClockIcon className="mr-2 h-5 w-5" />
              Timestamps
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <div>
              <Label>Created At</Label>
              <p className="text-gray-700">
                {formatDate(maintenance.created_at)}
              </p>
            </div>
            <div>
              <Label>Updated At</Label>
              <p className="text-gray-700">
                {formatDate(maintenance.updated_at)}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-full">
          <CardHeader className="flex flex-col md:flex-row items-center justify-between">
            <CardTitle>Maintenance Status and Notes</CardTitle>
            <div className="flex justify-end space-x-4">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline">
                    <CalendarIcon className="mr-2 h-4 w-4" /> Reschedule
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Reschedule Maintenance</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to reschedule this maintenance? This
                      action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <div className="py-4">
                    <Label htmlFor="new-date">New Date</Label>
                    <Input
                      id="new-date"
                      type="date"
                      onChange={(e) => handleReschedule(e.target.value)}
                    />
                  </div>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction>Confirm</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
              <Button>Save Changes</Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Status</Label>
              <Select value={status} onValueChange={handleStatusChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="DIJADWALKAN">Scheduled</SelectItem>
                  <SelectItem value="SELESAI">Completed</SelectItem>
                  <SelectItem value="TERTUNDA">Pending</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Notes</Label>
              <Textarea
                value={notes}
                onChange={handleNotesChange}
                className="h-32"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
