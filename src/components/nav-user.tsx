"use client";

import { useEffect, useState } from "react";
import { ChevronsUpDown, LogOut, Settings } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { getCurrentSession, logout } from "@/lib/auth"; // Assuming your auth function is here
import { getInitials } from "@/lib/utils";
import Link from "next/link";

export function NavUser() {
  const { isMobile } = useSidebar();
  const [user, setUser] = useState<{
    name: string;
    email: string;
    // avatar: string;
  } | null>(null);

  useEffect(() => {
    const fetchSession = async () => {
      const { user } = await getCurrentSession();
      if (user) {
        setUser({
          name: user.username,
          email: user.email,
          // avatar: user.avatar || "default-avatar.png", // Default avatar if not set
        });
      }
    };
    fetchSession();
  }, []);

  if (!user) {
    return (
      <div className="flex w-full h-full items-center justify-center">
        <p className="mt-4 text-lg font-medium text-muted-foreground animate-pulse">
          Loading...
        </p>
      </div>
    );
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={""} alt={user.name} />
                <AvatarFallback className="rounded-lg">
                  {getInitials(user.name)}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{user.name}</span>
                <span className="truncate text-xs">{user.email}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src="" alt={user.name} />
                  <AvatarFallback className="rounded-lg">
                    {getInitials(user.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{user.name}</span>
                  <span className="truncate text-xs">{user.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Link href="/settings" className="flex gap-2 items-center">
                <Settings />
                Settings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <button
                className="flex gap-2 items-center"
                onClick={async () => {
                  await logout();
                  window.location.reload();
                }}
              >
                <LogOut />
                Log out
              </button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
