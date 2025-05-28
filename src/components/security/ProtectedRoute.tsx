
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSecureAuth } from '@/hooks/useSecureAuth';
import { toast } from 'sonner';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'admin' | 'company' | 'tech';
  requiredPermission?: string;
  fallbackPath?: string;
}

export function ProtectedRoute({ 
  children, 
  requiredRole, 
  requiredPermission, 
  fallbackPath = '/login' 
}: ProtectedRouteProps) {
  const { user, isLoading, hasRole, hasPermission } = useSecureAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    toast.error('Please log in to access this page');
    return <Navigate to={fallbackPath} replace />;
  }

  if (requiredRole && !hasRole(requiredRole)) {
    toast.error('You do not have permission to access this page');
    return <Navigate to="/unauthorized" replace />;
  }

  if (requiredPermission && !hasPermission(requiredPermission)) {
    toast.error('You do not have the required permissions');
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
}
