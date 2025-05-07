
import React, { ReactNode } from "react";

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: Array<'admin' | 'company' | 'tech'>;
}

export function ProtectedRoute({ allowedRoles, children }: ProtectedRouteProps) {
  // Always render child routes, bypassing authentication checks
  console.log("ProtectedRoute: Authentication bypassed, allowing access");
  return <>{children}</>;
}
