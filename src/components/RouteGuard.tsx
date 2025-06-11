
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

interface RouteGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  allowedRoles?: ('admin' | 'company' | 'tech')[];
  redirectTo?: string;
}

export function RouteGuard({ 
  children, 
  requireAuth = true, 
  allowedRoles = [], 
  redirectTo = '/login' 
}: RouteGuardProps) {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  // Show loading while checking authentication status
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  // If authentication is required but user is not logged in
  if (requireAuth && !user) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // If user is logged in but accessing login/signup pages, redirect to dashboard
  if (!requireAuth && user && ['/login', '/signup'].includes(location.pathname)) {
    return <Navigate to={`/${user.role}`} replace />;
  }

  // Check role-based access if roles are specified
  if (requireAuth && user && allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
}
