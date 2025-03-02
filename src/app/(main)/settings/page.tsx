import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { getCurrentSession } from "@/lib/auth";
import { getInitials } from "@/lib/utils";
import UserNotification from "./_components/user-notification";
import UserActivityLogs from "./_components/user-activity-logs";
import ResetPasswordForm from "./_components/form-reset-password";

export default async function UserProfileBento() {
  const { user } = await getCurrentSession();
  if (!user) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pt-4">
      <Card className="col-span-full bg-gradient-to-r dark:from-cyan-600 dark:to-pink-600 from-cyan-400 to-pink-400">
        <CardContent className="flex justify-between items-center p-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">User Profile</h1>
            <p className="text-xl">{user.email}</p>
            <Badge variant="secondary" className="mt-2">
              {user.role}
            </Badge>
          </div>
          <div className="flex flex-col gap-2 items-center justify-center">
            <Avatar className="h-24 w-24 border-4 ">
              <AvatarImage src="/placeholder-avatar.jpg" alt={user.username} />
              <AvatarFallback>
                {getInitials(user.username).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <p className="font-bold">{user.username}</p>
          </div>
        </CardContent>
      </Card>
      <ResetPasswordForm />
      <UserNotification />
      <UserActivityLogs />
    </div>
  );
}
