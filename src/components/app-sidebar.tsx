"use client";

import * as React from "react";
import {
  Archive,
  BookA,
  Box,
  FileText,
  GalleryVerticalEnd,
  MapPin,
  SquareTerminal,
  UserRound,
  Users2,
  Wrench,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavAdmin } from "@/components/nav-admin";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { AppLogo } from "./sidebar-logo";

// This is sample data.
const data = {
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
      url: "/assets",
      icon: Box,
      items: [
        { title: "Asset Types", url: "/assets/types" },
        { title: "Check-In", url: "/assets/checkin" },
        { title: "Check-Out", url: "/assets/checkout" },
      ],
    },
    {
      title: "Locations",
      url: "/locations",
      icon: MapPin,
    },
    {
      title: "Inventory",
      url: "/inventory",
      icon: Archive,
      // items: [
      //   { title: "Manage Inventory", url: "/inventory/manage" },
      //   { title: "Inventory Locations", url: "/inventory/locations" },
      //   { title: "Inventory Transactions", url: "/inventory/transactions" },
      // ],
    },
    {
      title: "Maintenance",
      url: "/maintenance",
      icon: Wrench,
      items: [{ title: "Schedule Maintenance", url: "/maintenance/schedule" }],
    },
    {
      title: "Reports",
      url: "/reports",
      icon: FileText,
    },
    // {
    //   title: "Notification",
    //   url: "/notification",
    //   icon: Bell,
    // },
  ],
  admin: [
    {
      name: "Employees",
      url: "/employees",
      icon: Users2,
    },
    {
      name: "Activity Logs",
      url: "/activities",
      icon: BookA,
    },
    {
      name: "User Management",
      url: "/users",
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
      <SidebarSeparator />
      <SidebarContent>
        <NavMain items={data.navMain} />
        <SidebarSeparator />
        <NavAdmin items={data.admin} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
