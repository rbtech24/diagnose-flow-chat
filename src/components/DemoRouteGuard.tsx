
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useDemoAuth } from '@/hooks/useDemoAuth';

interface DemoRouteGuardProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

export function DemoRouteGuard({ children, allowedRoles }: DemoRouteGuardProps) {
  const { user } = useDemoAuth();

  if (!user) {
    return <Navigate to="/dev-login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dev-login" replace />;
  }

  return <>{children}</>;
}
