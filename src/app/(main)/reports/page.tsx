import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { DatePickerWithRange } from "@/components/ui/date-range-picker";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  BarChart,
  FileSpreadsheet,
  FileText,
  ClipboardList,
  PackageSearch,
  Users,
} from "lucide-react";
import { Fragment, ReactNode } from "react";

const reportTypes = [
  {
    title: "Asset Reports",
    description:
      "Overview of all assets, including name, status, type, and value.",
    icon: <BarChart className="h-8 w-8" />,
    model: "Asset",
  },
  {
    title: "Maintenance Reports",
    description: "Scheduled, pending, and completed maintenance records.",
    icon: <FileSpreadsheet className="h-8 w-8" />,
    model: "Maintenance",
  },
  {
    title: "Inventory Reports",
    description: "Stock levels, reorder alerts, and inventory value.",
    icon: <PackageSearch className="h-8 w-8" />,
    model: "Inventory",
  },
  {
    title: "Check-In/Out Reports",
    description: "Asset usage and return records, late returns analysis.",
    icon: <ClipboardList className="h-8 w-8" />,
    model: "CheckInOut",
  },
  {
    title: "Activity Logs",
    description: "User actions, including CREATE, UPDATE, and DELETE events.",
    icon: <FileText className="h-8 w-8" />,
    model: "ActivityLog",
  },
  {
    title: "Employee Reports",
    description: "Performance and activity summary, assigned assets and tasks.",
    icon: <Users className="h-8 w-8" />,
    model: "Employee",
  },
];

export default function ReportsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Reports</h1>
        <p className="text-gray-600 mb-4">
          Generate and customize various reports based on available data
          schemas.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reportTypes.map((report, index) => (
          <ReportCard
            key={index}
            title={report.title}
            description={report.description}
            icon={report.icon}
            model={report.model}
          />
        ))}
      </div>
    </div>
  );
}
type ReportCard = {
  title: string;
  description: string;
  icon: ReactNode;
  model: string;
};

function ReportCard({ title, description, icon, model }: ReportCard) {
  return (
    <Card className="hover:shadow-lg transition-shadow duration-300">
      <CardHeader>
        <div className="flex items-center gap-4">
          {icon}
          <div>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="w-full">Generate Report</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Customize {title}</DialogTitle>
              <DialogDescription>
                Set your preferences for the report generation.
              </DialogDescription>
            </DialogHeader>
            <ReportCustomizationForm model={model} />
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}

function ReportCustomizationForm({ model }: { model: string }) {
  const fields = getFieldsForModel(model);

  return (
    <form className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="date-range">Date Range</Label>
        <DatePickerWithRange />
      </div>
      <div className="space-y-2">
        <Label htmlFor="status-filter">Status Filter</Label>
        <Select>
          <SelectTrigger id="status-filter">
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            {getStatusOptionsForModel(model).map((status) => (
              <SelectItem key={status} value={status.toLowerCase()}>
                {status}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label>Fields to Include</Label>
        <ScrollArea className="h-[200px] w-full rounded-md border p-4">
          <div className="space-y-2">
            {fields.map((field) => (
              <FieldCheckbox key={field} id={`field-${field}`} label={field} />
            ))}
          </div>
        </ScrollArea>
      </div>
      <div className="space-y-2">
        <Label htmlFor="sort-by">Sort By</Label>
        <Select>
          <SelectTrigger id="sort-by">
            <SelectValue placeholder="Select sorting option" />
          </SelectTrigger>
          <SelectContent>
            {fields.map((field) => (
              <Fragment key={field}>
                <SelectItem value={`${field}-asc`}>
                  {field} (Ascending)
                </SelectItem>
                <SelectItem value={`${field}-desc`}>
                  {field} (Descending)
                </SelectItem>
              </Fragment>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="export-format">Export Format</Label>
        <Select>
          <SelectTrigger id="export-format">
            <SelectValue placeholder="Select export format" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pdf">PDF</SelectItem>
            <SelectItem value="excel">Excel</SelectItem>
            <SelectItem value="csv">CSV</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Button className="w-full">Generate and Export Report</Button>
    </form>
  );
}

function FieldCheckbox({ id, label }) {
  return (
    <div className="flex items-center space-x-2">
      <Checkbox id={id} />
      <Label htmlFor={id}>{label}</Label>
    </div>
  );
}

function getFieldsForModel(model: string) {
  switch (model) {
    case "Asset":
      return [
        "id",
        "name",
        "type_id",
        "status",
        "purchase_date",
        "lifecycle_stage",
        "initial_value",
        "salvage_value",
        "useful_life",
      ];
    case "Maintenance":
      return [
        "id",
        "asset_id",
        "mechanic_id",
        "scheduled_date",
        "status",
        "notes",
      ];
    case "Inventory":
      return [
        "id",
        "name",
        "category",
        "quantity",
        "reorder_level",
        "unit_price",
        "location_id",
      ];
    case "CheckInOut":
      return [
        "id",
        "asset_id",
        "user_id",
        "employee_id",
        "check_out_date",
        "expected_return_date",
        "actual_return_date",
        "status",
      ];
    case "ActivityLog":
      return [
        "id",
        "user_id",
        "action",
        "target_type",
        "target_id",
        "timestamp",
      ];
    case "Employee":
      return ["id", "name", "department", "phone", "email"];
    default:
      return [];
  }
}

function getStatusOptionsForModel(model) {
  switch (model) {
    case "Asset":
      return ["AKTIF", "TIDAK_AKTIF", "RUSAK"];
    case "Maintenance":
      return ["DIJADWALKAN", "SELESAI", "TERTUNDA"];
    case "CheckInOut":
      return ["DIPINJAM", "DIKEMBALIKAN", "JATUH_TEMPO"];
    default:
      return [];
  }
}
