import { getCheckInOutsByEmployeeId } from "@/actions/checkinout-actions";
import { getEmployeeById } from "@/actions/employee-actions";
import { DataTable } from "@/components/table/data-table";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";
import { ArrowLeft, BriefcaseBusiness, Edit, Mail, Phone } from "lucide-react";
import Link from "next/link";
import { employeeCheckoutHistoryColumns } from "./collumn";
import EditEmployeeForm from "../_components/form-edit";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export const dynamic = "force-dynamic";
type Params = Promise<{ slug: string }>;
type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function Page(props: {
  params: Params;
  searchParams: SearchParams;
}) {
  const searchParams = await props.searchParams;

  const id = parseInt(searchParams.id);

  const data = await getEmployeeById(id);
  const checkoutHistory = await getCheckInOutsByEmployeeId(id);

  return (
    <div className="flex flex-col gap-4 mt-4">
      <div className="mb-2 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Button
            asChild
            variant="default"
            size="icon"
            className="flex items-center justify-center shadow-md"
          >
            <Link href="/employees">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-2xl md:text-3xl font-bold">{data.name}</h1>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Edit className="h-4 w-4" />
              Edit
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogTitle>Edit Employee</DialogTitle>
            <EditEmployeeForm data={data} />
          </DialogContent>
        </Dialog>
      </div>
      <div className="flex flex-col md:flex-row gap-4 w-full">
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
            <CardDescription>Employee ID: {data.id}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4 items-center">
              <BriefcaseBusiness /> : {data.department}
            </div>
            <div className="flex gap-4 items-center">
              <Mail /> : {data.email}
            </div>
            <div className="flex gap-4 items-center">
              <Phone /> : {data.phone}
            </div>
          </CardContent>
        </Card>
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-lg">System Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <span className="text-sm text-muted-foreground">
                Member since
              </span>
              <p>{data.created_at.toLocaleDateString()}</p>
              <p className="text-xs text-muted-foreground">
                {formatDistanceToNow(data.created_at, { addSuffix: true })}
              </p>
            </div>
            <div>
              <span className="text-sm text-muted-foreground">
                Last updated
              </span>
              <p>{data.updated_at.toLocaleDateString()}</p>
              <p className="text-xs text-muted-foreground">
                {formatDistanceToNow(data.updated_at, { addSuffix: true })}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="flex flex-col gap-4">
        <h1 className="font-bold text-xl">Asset Checkout History</h1>
        <DataTable
          columns={employeeCheckoutHistoryColumns}
          data={checkoutHistory}
        />
      </div>
    </div>
  );
}
