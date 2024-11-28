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
import { getCurrentSession } from "@/lib/auth";
import { Role } from "@prisma/client";
import { useEffect, useState } from "react";

export function NavAdmin({
  items,
}: {
  items: {
    name: string;
    url: string;
    icon: LucideIcon;
  }[];
}) {
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const fetchSession = async () => {
      const { user } = await getCurrentSession();
      // console.log(session);
      if (user) {
        setRole(user.role);
      }
    };
    fetchSession();
  }, []);

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
                <item.icon />
                <span>{item.name}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
