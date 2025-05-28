
import { useState, useEffect } from 'react';
import { User } from '@/types/user';
import { useAuth } from '@/context/AuthContext';

interface SecureAuthState {
  user: User | null;
  isLoading: boolean;
  hasRole: (role: 'admin' | 'company' | 'tech') => boolean;
  hasPermission: (permission: string) => boolean;
}

export function useSecureAuth(): SecureAuthState {
  const { user, isLoading } = useAuth();
  const [authState, setAuthState] = useState<SecureAuthState>({
    user: null,
    isLoading: true,
    hasRole: () => false,
    hasPermission: () => false
  });

  useEffect(() => {
    const hasRole = (role: 'admin' | 'company' | 'tech'): boolean => {
      if (!user) return false;
      return user.role === role;
    };

    const hasPermission = (permission: string): boolean => {
      if (!user) return false;
      
      // Define role-based permissions
      const permissions = {
        admin: [
          'manage_users',
          'manage_companies',
          'manage_workflows',
          'view_analytics',
          'manage_system_messages',
          'manage_api_keys'
        ],
        company: [
          'manage_technicians',
          'view_workflows',
          'create_support_tickets',
          'manage_subscription'
        ],
        tech: [
          'use_diagnostics',
          'create_support_tickets',
          'view_community'
        ]
      };

      const userPermissions = permissions[user.role] || [];
      return userPermissions.includes(permission);
    };

    setAuthState({
      user,
      isLoading,
      hasRole,
      hasPermission
    });
  }, [user, isLoading]);

  return authState;
}
