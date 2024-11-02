"use client";

import * as React from "react";
import {
  Archive,
  BookA,
  Boxes,
  Frame,
  GalleryVerticalEnd,
  Settings2,
  SquareTerminal,
  UserRound,
  Wrench,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavProjects } from "@/components/nav-admin";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { AppLogo } from "./sidebar-logo";
import { Separator } from "./ui/separator";

// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  app: {
    name: "Asset Mnagement",
    logo: GalleryVerticalEnd,
    plan: "Dewabiz",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: SquareTerminal,
    },
    {
      title: "Assets",
      url: "#",
      icon: Archive,
      items: [
        {
          title: "Overview",
          url: "/dashboard/assets",
        },
        {
          title: "Check-In",
          url: "/dashboard/assets/check-in",
        },
        {
          title: "Check-Out",
          url: "/dashboard/assets/check-out",
        },
      ],
    },
    {
      title: "Inventory",
      url: "/dashboard/inventory",
      icon: Boxes,
    },
    {
      title: "Maintenance",
      url: "/dashboard/maintenance",
      icon: Wrench,
    },

    {
      title: "Settings",
      url: "/dashboard/settings",
      icon: Settings2,
    },
  ],
  projects: [
    {
      name: "Categories",
      url: "/dashboard/assets/categories",
      icon: Frame,
    },
    {
      name: "Activities",
      url: "/dashboard/activities",
      icon: BookA,
    },
    {
      name: "Users",
      url: "/dashboard/users",
      icon: UserRound,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <AppLogo app={data.app} />
      </SidebarHeader>
      <Separator />
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
