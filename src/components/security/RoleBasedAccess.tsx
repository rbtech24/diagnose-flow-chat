
import React from 'react';
import { useSecureAuth } from '@/hooks/useSecureAuth';
import { AlertTriangle } from 'lucide-react';

interface RoleBasedAccessProps {
  children: React.ReactNode;
  requiredRole?: 'admin' | 'company' | 'tech';
  requiredPermission?: string;
  fallback?: React.ReactNode;
}

export function RoleBasedAccess({ 
  children, 
  requiredRole, 
  requiredPermission, 
  fallback 
}: RoleBasedAccessProps) {
  const { user, hasRole, hasPermission } = useSecureAuth();

  if (!user) {
    return fallback || (
      <div className="flex items-center justify-center p-4 text-muted-foreground">
        <AlertTriangle className="w-4 h-4 mr-2" />
        Authentication required
      </div>
    );
  }

  if (requiredRole && !hasRole(requiredRole)) {
    return fallback || (
      <div className="flex items-center justify-center p-4 text-muted-foreground">
        <AlertTriangle className="w-4 h-4 mr-2" />
        Insufficient role permissions
      </div>
    );
  }

  if (requiredPermission && !hasPermission(requiredPermission)) {
    return fallback || (
      <div className="flex items-center justify-center p-4 text-muted-foreground">
        <AlertTriangle className="w-4 h-4 mr-2" />
        Insufficient permissions
      </div>
    );
  }

  return <>{children}</>;
}
