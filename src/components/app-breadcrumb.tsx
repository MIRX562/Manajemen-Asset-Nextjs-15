"use client";

import { usePathname } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbSeparator,
  BreadcrumbLink,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import React from "react";

export default function DynamicBreadcrumb({
  prefix = "",
}: {
  prefix?: string;
}) {
  const pathname = usePathname();
  const pathSegments = pathname.split("/").filter(Boolean);

  // Remove prefix segments from the path
  const prefixSegments = prefix.split("/").filter(Boolean);
  const segments = pathSegments.slice(prefixSegments.length);

  // Helper function to format path segments
  const formatSegment = (segment: string) =>
    decodeURIComponent(segment) // Decode URI components (e.g., "%20" -> " ")
      .replace(/-/g, " ") // Replace dashes with spaces
      .replace(/_/g, " ") // Replace underscores with spaces
      .replace(/\b\w/g, (char) => char.toUpperCase()); // Capitalize first letter of each word

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {segments.map((segment, index) => {
          const href =
            "/" +
            [...prefixSegments, ...segments.slice(0, index + 1)].join("/");
          const isLast = index === segments.length - 1;

          return (
            <React.Fragment key={href}>
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage className="font-bold">
                    {formatSegment(segment)}
                  </BreadcrumbPage>
                ) : (
                  <BreadcrumbLink href={href}>
                    {formatSegment(segment)}
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
              {!isLast && <BreadcrumbSeparator />}
            </React.Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
