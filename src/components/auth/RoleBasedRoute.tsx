
import React, { ReactNode } from 'react';
import { useAuth } from '@/context/auth';

interface RoleBasedRouteProps {
  children: ReactNode;
  allowedRoles: string[];
}

export function RoleBasedRoute({ children }: RoleBasedRouteProps) {
  const { user } = useAuth();

  // Since we're bypassing authentication, always render the children
  if (!user) {
    console.log("No user found, but continuing anyway");
  }

  return <>{children}</>;
}
