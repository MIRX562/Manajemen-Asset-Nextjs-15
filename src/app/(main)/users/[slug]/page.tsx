import { getUserDetail } from "@/actions/user-actions";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckInOutStatus, MaintenanceStatus } from "@prisma/client";
import { formatDistanceToNow } from "date-fns";
import {
  CalendarDays,
  CheckCircle,
  ClipboardList,
  Clock,
  FileText,
  UserIcon,
  XCircle,
} from "lucide-react";

export const dynamic = "force-dynamic";

type Params = Promise<{ slug: string }>;
type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function UserDetailPage(props: {
  params: Params;
  searchParams: SearchParams;
}) {
  const params = await props.params;
  const searchParams = await props.searchParams;

  const slug = params.slug;
  const id = parseInt(searchParams.id);

  const user = await getUserDetail(id);
  if (!user) return null;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "COMPLETED":
      case "RETURNED":
        return <Badge className="bg-green-500">Completed</Badge>;
      case "SCHEDULED":
        return <Badge className="bg-blue-500">Scheduled</Badge>;
      case "CHECKED_OUT":
        return <Badge className="bg-yellow-500">Checked Out</Badge>;
      default:
        return <Badge className="bg-gray-500">{status}</Badge>;
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">
          {slug} - User Details
        </h1>
      </div>

      {/* User Profile Card */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage
                  src={`/placeholder.svg?height=64&width=64`}
                  alt={user.username}
                />
                <AvatarFallback className="text-lg">
                  {user.username.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-2xl">{user.username}</CardTitle>
                <CardDescription className="text-base flex items-center gap-2">
                  <span>{user.email}</span>
                  <Badge>{user.role}</Badge>
                  {user.Session ? (
                    <Badge
                      variant="outline"
                      className="bg-green-50 text-green-700 border-green-200 flex items-center gap-1"
                    >
                      <div className="w-2 h-2 rounded-full bg-green-500"></div>{" "}
                      Active
                    </Badge>
                  ) : (
                    <Badge
                      variant="outline"
                      className="bg-gray-50 text-gray-700 border-gray-200 flex items-center gap-1"
                    >
                      <div className="w-2 h-2 rounded-full bg-gray-500"></div>{" "}
                      Inactive
                    </Badge>
                  )}
                </CardDescription>
              </div>
            </div>
            <div className="text-sm text-muted-foreground space-y-1">
              <div className="flex items-center gap-1">
                <UserIcon className="h-4 w-4" />
                <span>ID: {user.id}</span>
              </div>
              <div className="flex items-center gap-1">
                <CalendarDays className="h-4 w-4" />
                <span>
                  Created:{" "}
                  {formatDistanceToNow(user.created_at, { addSuffix: true })}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>
                  Updated:{" "}
                  {formatDistanceToNow(user.updated_at, { addSuffix: true })}
                </span>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Tabs for Related Data */}
      <Tabs defaultValue="activity" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="activity">Activity Logs</TabsTrigger>
          <TabsTrigger value="maintenance">Maintenance Tasks</TabsTrigger>
          <TabsTrigger value="checkinout">Check In/Out Records</TabsTrigger>
        </TabsList>

        {/* Activity Logs Tab */}
        <TabsContent value="activity">
          <Card>
            <CardHeader>
              <CardTitle>Activity Logs</CardTitle>
              <CardDescription>
                Recent actions performed by this user
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {user.activityLogs.map((log) => (
                  <div
                    key={log.id}
                    className="flex items-start gap-4 p-3 border rounded-lg"
                  >
                    <div className="bg-muted rounded-full p-2">
                      <FileText className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">
                          {log.action.replace(/_/g, " ")}
                        </h4>
                        <span className="text-sm text-muted-foreground">
                          {formatDistanceToNow(log.timestamp, {
                            addSuffix: true,
                          })}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {log.description}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="outline">{log.target_type}</Badge>
                        <span className="text-xs text-muted-foreground">
                          ID: {log.target_id}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
                {user.activityLogs.length === 0 && (
                  <div className="text-center py-6 text-muted-foreground">
                    No activity logs found for this user.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Maintenance Tasks Tab */}
        <TabsContent value="maintenance">
          <Card>
            <CardHeader>
              <CardTitle>Maintenance Tasks</CardTitle>
              <CardDescription>
                Tasks assigned to this user as a mechanic
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {user.maintenances.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-start gap-4 p-3 border rounded-lg"
                  >
                    <div className="bg-muted rounded-full p-2">
                      {task.status === MaintenanceStatus.SELESAI ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : (
                        <ClipboardList className="h-5 w-5" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">{task.asset.name}</h4>
                        {getStatusBadge(task.status)}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {task.notes}
                      </p>
                      <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
                        <div>
                          <span className="text-muted-foreground">
                            Asset ID:
                          </span>{" "}
                          {task.asset_id}
                        </div>
                        <div>
                          <span className="text-muted-foreground">
                            Scheduled:
                          </span>{" "}
                          {task.scheduled_date.toLocaleDateString()}
                        </div>
                        {task.status == MaintenanceStatus.SELESAI && (
                          <div className="col-span-2">
                            <span className="text-muted-foreground">
                              Completed:
                            </span>{" "}
                            {task.updated_at.toLocaleDateString()}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                {user.maintenances.length === 0 && (
                  <div className="text-center py-6 text-muted-foreground">
                    No maintenance tasks assigned to this user.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Check In/Out Records Tab */}
        <TabsContent value="checkinout">
          <Card>
            <CardHeader>
              <CardTitle>Check In/Out Records</CardTitle>
              <CardDescription>
                Asset check-out and return records managed by this user
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {user.CheckInOut.map((record) => (
                  <div
                    key={record.id}
                    className="flex items-start gap-4 p-3 border rounded-lg"
                  >
                    <div className="bg-muted rounded-full p-2">
                      {record.status === CheckInOutStatus.DIKEMBALIKAN ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : (
                        <XCircle className="h-5 w-5 text-yellow-500" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">{record.asset.name}</h4>
                        {getStatusBadge(record.status)}
                      </div>
                      <p className="text-sm mt-1">
                        <span className="text-muted-foreground">
                          Assigned to:
                        </span>{" "}
                        {record.employee.name}
                      </p>
                      <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
                        <div>
                          <span className="text-muted-foreground">
                            Checked out:
                          </span>{" "}
                          {record.check_out_date.toLocaleDateString()}
                        </div>
                        <div>
                          <span className="text-muted-foreground">
                            Expected return:
                          </span>{" "}
                          {record.expected_return_date.toLocaleDateString()}
                        </div>
                        {record.actual_return_date && (
                          <div className="col-span-2">
                            <span className="text-muted-foreground">
                              Returned:
                            </span>{" "}
                            {record.actual_return_date.toLocaleDateString()}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                {user.CheckInOut.length === 0 && (
                  <div className="text-center py-6 text-muted-foreground">
                    No check in/out records managed by this user.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
