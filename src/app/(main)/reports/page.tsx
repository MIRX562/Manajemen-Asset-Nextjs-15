import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  BarChart,
  FileSpreadsheet,
  FileText,
  ClipboardList,
  PackageSearch,
  Users,
} from "lucide-react";
import { ReactNode } from "react";
import AssetReportForm from "./_components/asset-report-form";
import MaintenanceReportForm from "./_components/maintenance-report-form";
import InventoryReportForm from "./_components/inventory-report-form";

export const dynamic = "force-dynamic";

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
  // {
  //   title: "Check-In/Out Reports",
  //   description: "Asset usage and return records, late returns analysis.",
  //   icon: <ClipboardList className="h-8 w-8" />,
  //   model: "CheckInOut",
  // },
  // {
  //   title: "Activity Logs",
  //   description: "User actions, including CREATE, UPDATE, and DELETE events.",
  //   icon: <FileText className="h-8 w-8" />,
  //   model: "ActivityLog",
  // },
  // {
  //   title: "Employee Reports",
  //   description: "Performance and activity summary, assigned assets and tasks.",
  //   icon: <Users className="h-8 w-8" />,
  //   model: "Employee",
  // },
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
  switch (model) {
    case "Asset":
      return <AssetReportForm />;
    case "Maintenance":
      return <MaintenanceReportForm />;
    case "Inventory":
      return <InventoryReportForm />;
    // case "CheckInOut":
    //   return <CheckInOutReportForm />;
    // case "ActivityLog":
    //   return <ActivityLogReportForm />;
    // case "Employee":
    //   return <EmployeeReportForm />;
    default:
      return null;
  }
}
