"use client";
import { Role } from "@prisma/client";
import React, { ReactNode } from "react";
import AccessDenied from "./access-denied";
import { useUserStore } from "@/stores/user-store";
import type { User } from "@prisma/client";

interface RbacWrapperProps {
  children: ReactNode;
  requiredRole: Role;
}

export default function RbacWrapper({
  children,
  requiredRole,
}: RbacWrapperProps) {
  const user = useUserStore((state: { user: User | null }) => state.user);
  const Role = user?.role;

  return Role === requiredRole ? <>{children}</> : <AccessDenied />;
}
