
import { Outlet } from "react-router-dom";

interface ProtectedRouteProps {
  allowedRoles?: Array<'admin' | 'company' | 'tech'>;
}

export function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  // Always render child routes, bypassing authentication checks
  console.log("ProtectedRoute: Authentication bypassed, allowing access");
  return <Outlet />;
}
