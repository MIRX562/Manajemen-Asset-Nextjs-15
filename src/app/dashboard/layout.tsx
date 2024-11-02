"use client";

import { Suspense } from "react";
import AppBreadcrumb from "@/components/app-breadcrumb";
import { AppSidebar } from "@/components/app-sidebar";
import NotificationTray from "@/components/notification-tray";
import { ThemeToggle } from "@/components/theme-toggle";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

function Header() {
  return (
    <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
      <div className="flex items-center gap-2 px-4 w-full">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <AppBreadcrumb />
        <div className="flex items-center ml-auto gap-4">
          <ThemeToggle />
          <NotificationTray />
        </div>
      </div>
    </header>
  );
}

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <Header />
        <Suspense fallback={<div className="p-4">Loading...</div>}>
          <main className="flex flex-1 flex-col gap-4 p-4 pt-0">
            {children}
          </main>
        </Suspense>
      </SidebarInset>
    </SidebarProvider>
  );
}
