"use client";

import { ChevronRight, type LucideIcon } from "lucide-react";
import { usePathname } from "next/navigation";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { useUser } from "@/context/session";

export function NavMain({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon?: LucideIcon;
    items?: {
      title: string;
      url: string;
    }[];
  }[];
}) {
  const currentPath = usePathname();
  const user = useUser();
  const role = user.user?.role;

  // Filter items based on role
  const filteredItems =
    role === "TEKNISI"
      ? items.filter(
          (item) => item.title === "Dashboard" || item.title === "Maintenance"
        )
      : role === "INVENTARIS"
      ? items.filter((item) => item.title !== "Maintenance")
      : items;

  return (
    <SidebarGroup>
      <SidebarGroupLabel>General</SidebarGroupLabel>
      <SidebarMenu>
        {filteredItems.map((item) => {
          const isOpen =
            currentPath === item.url ||
            item.items?.some((subItem) => currentPath === subItem.url);

          return (
            <Collapsible
              key={item.title}
              asChild
              defaultOpen={isOpen} // Set open state based on current path
              className="group/collapsible"
            >
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <Link href={item.url}>
                    <SidebarMenuButton tooltip={item.title}>
                      {item.icon && <item.icon className="text-primary" />}
                      <span>{item.title}</span>
                      {item.items && item.items.length > 0 && (
                        <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                      )}
                    </SidebarMenuButton>
                  </Link>
                </CollapsibleTrigger>
                {item.items && item.items.length > 0 && (
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {item.items.map((subItem) => (
                        <SidebarMenuSubItem key={subItem.title}>
                          <SidebarMenuSubButton asChild>
                            <a href={subItem.url}>
                              <span>{subItem.title}</span>
                            </a>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                )}
              </SidebarMenuItem>
            </Collapsible>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
