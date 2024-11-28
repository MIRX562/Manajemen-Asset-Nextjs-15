// RbacWrapper.tsx
import { getCurrentSession } from "@/lib/auth";
import { Role } from "@prisma/client";
import React, { ReactNode } from "react";
import AccessDenied from "./access-denied";

interface RbacWrapperProps {
  children: ReactNode;
  requiredRole: Role;
}

/**
 * Role-Based Access Control (RBAC) wrapper component that renders content only if
 * the user's role matches the required role.
 *
 * @param {ReactNode} children - The content to render if access is granted.
 * @param {Role} requiredRole - The exact role required to access the content.
 * @returns {ReactNode} The content or fallback based on the user's role match.
 */
export default async function RbacWrapper({
  children,
  requiredRole,
}: RbacWrapperProps) {
  const session = await getCurrentSession();
  const Role = session?.user?.role;

  return Role === requiredRole ? <>{children}</> : <AccessDenied />;
}
