
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
  allowedRoles?: Array<'admin' | 'company' | 'tech'>;
}

export function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const { isAuthenticated, userRole, isLoading } = useAuth();

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <div className="flex flex-col items-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="mt-2 text-gray-500">Loading authentication...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    console.log("User not authenticated, redirecting to login");
    return <Navigate to="/login" />;
  }

  // For admin role, allow access to all protected routes regardless of allowedRoles
  if (userRole === 'admin') {
    console.log("Admin user, granting access");
    return <Outlet />;
  }
  
  // Check for role-based authorization for non-admin users
  if (allowedRoles && userRole && !allowedRoles.includes(userRole)) {
    console.log(`User role ${userRole} not in allowed roles: ${allowedRoles.join(', ')}`);
    // Redirect to appropriate dashboard based on role
    if (userRole === 'company') return <Navigate to="/company" />;
    if (userRole === 'tech') return <Navigate to="/tech" />;
    return <Navigate to="/" />;
  }

  // Render child routes if authorized
  console.log(`User authorized with role: ${userRole}`);
  return <Outlet />;
}
