
import { useAuth } from '@/context/AuthContext';
import { useUserRole } from './useUserRole';
import { useEffect, useState } from 'react';

export interface AuthIntegrationState {
  isAuthenticated: boolean;
  userRole: 'admin' | 'company' | 'tech';
  hasPermission: (permission: string) => boolean;
  canAccessRoute: (route: string) => boolean;
  isLoading: boolean;
}

export function useAuthIntegration(): AuthIntegrationState {
  const { user, isLoading: authLoading } = useAuth();
  const { userRole, isLoading: roleLoading } = useUserRole();
  const [authState, setAuthState] = useState<AuthIntegrationState>({
    isAuthenticated: false,
    userRole: 'company',
    hasPermission: () => false,
    canAccessRoute: () => false,
    isLoading: true
  });

  useEffect(() => {
    const isAuthenticated = !!user;
    const isLoading = authLoading || roleLoading;

    const hasPermission = (permission: string): boolean => {
      if (!isAuthenticated) return false;
      
      const rolePermissions = {
        admin: ['all'],
        company: ['manage_technicians', 'view_workflows', 'manage_company'],
        tech: ['use_diagnostics', 'view_community', 'create_tickets']
      };

      const permissions = rolePermissions[userRole] || [];
      return permissions.includes('all') || permissions.includes(permission);
    };

    const canAccessRoute = (route: string): boolean => {
      if (!isAuthenticated) {
        // Allow access to public routes
        const publicRoutes = ['/', '/login', '/signup', '/forgot-password', '/about', '/contact'];
        return publicRoutes.includes(route);
      }
      
      const routeAccess = {
        '/admin': ['admin'],
        '/company': ['admin', 'company'],
        '/tech': ['admin', 'company', 'tech'],
        '/workflows': ['admin', 'company'],
        '/diagnostics': ['admin', 'company', 'tech']
      };

      const allowedRoles = routeAccess[route as keyof typeof routeAccess];
      if (!allowedRoles) return true; // Allow access to routes not specifically restricted
      
      return allowedRoles.includes(userRole);
    };

    setAuthState({
      isAuthenticated,
      userRole,
      hasPermission,
      canAccessRoute,
      isLoading
    });
  }, [user, userRole, authLoading, roleLoading]);

  return authState;
}
