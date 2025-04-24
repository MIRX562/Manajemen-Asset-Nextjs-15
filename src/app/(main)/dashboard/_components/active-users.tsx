import { Users } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import prisma from "@/lib/db";

export default async function OnlineUsers() {
  const onlineUsers = await prisma.user.findMany({
    where: {
      Session: {
        some: {},
      },
    },
    select: {
      id: true,
      username: true,
      email: true,
      role: true,
    },
  });

  return (
    <Card className="col-span-1">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl flex items-center gap-2">
            <Users className="h-5 w-5" />
            Active Users
          </CardTitle>
        </div>
        <CardDescription>
          {onlineUsers.length} users currently online
        </CardDescription>
      </CardHeader>
      <Separator />
      <CardContent className="pt-4">
        <ScrollArea className="h-[280px] pr-4">
          {onlineUsers.map((user) => (
            <div key={user.id} className="flex items-center gap-4 py-3">
              <div className="relative">
                <Avatar>
                  <AvatarImage src={"/placeholder.svg"} alt={user.username} />
                  <AvatarFallback>{user.username.charAt(0)}</AvatarFallback>
                </Avatar>
              </div>
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium leading-none">
                  {user.username}
                </p>
                <p className="text-xs text-muted-foreground">{user.email}</p>
              </div>
              <Badge>{user.role}</Badge>
            </div>
          ))}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
