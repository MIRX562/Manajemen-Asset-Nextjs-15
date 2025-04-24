"use client";

import { type LucideIcon } from "lucide-react";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { Role } from "@prisma/client";
import { useUser } from "@/context/session";

export function NavAdmin({
  items,
}: {
  items: {
    name: string;
    url: string;
    icon: LucideIcon;
  }[];
}) {
  const { user } = useUser();
  const role = user?.role;
  if (!role) {
    return (
      <div className="flex w-full h-full items-center justify-center">
        <p className="mt-4 text-lg font-medium text-muted-foreground animate-pulse">
          Loading...
        </p>
      </div>
    );
  }

  if (role !== Role.ADMIN) {
    return null;
  }

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Admin</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => (
          <SidebarMenuItem key={item.name}>
            <SidebarMenuButton asChild tooltip={item.name}>
              <Link prefetch={true} href={item.url}>
                <item.icon className="text-primary" />
                <span>{item.name}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
