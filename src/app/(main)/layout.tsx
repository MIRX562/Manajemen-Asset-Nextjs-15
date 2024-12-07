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
import Loading from "./loading";
import { ThemeProvider } from "@/components/theme-provider";
import { NotificationProvider } from "@/context/notifications";
import { DropdownProvider } from "@/context/dropdown";

function Header() {
  return (
    <header className="sticky top-0 z-1 flex h-16 shrink-0 items-center gap-2 bg-background/30 backdrop-blur-md shadow-md dark:border-b transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
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
    <NotificationProvider>
      <DropdownProvider>
        <ThemeProvider>
          <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
              <Header />
              <Suspense fallback={<Loading />}>
                <main className="flex flex-1 flex-col gap-4 p-4 pt-0 overflow-y-auto">
                  {children}
                </main>
              </Suspense>
            </SidebarInset>
          </SidebarProvider>
        </ThemeProvider>
      </DropdownProvider>
    </NotificationProvider>
  );
}
