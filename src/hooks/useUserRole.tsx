
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

type UserRole = 'admin' | 'company' | 'tech';

export function useUserRole() {
  const [userRole, setUserRole] = useState<UserRole>('company');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function getCurrentUser() {
      try {
        // Attempt to get the user from Supabase
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          // Get role from user metadata if available
          const userMetadata = user.user_metadata;
          if (userMetadata && userMetadata.role && 
              ['admin', 'company', 'tech'].includes(userMetadata.role)) {
            setUserRole(userMetadata.role as UserRole);
          } else {
            // Fallback to determining role from URL
            determineRoleFromURL();
          }
        } else {
          // No authenticated user - fallback to determining role from URL
          determineRoleFromURL();
        }
      } catch (error) {
        console.error('Error getting user role:', error);
        // Fallback to basic role determination
        determineRoleFromURL();
      } finally {
        setIsLoading(false);
      }
    }

    getCurrentUser();
  }, []);
  
  // Helper function to determine role from URL
  function determineRoleFromURL() {
    const path = window.location.pathname;
    if (path.startsWith('/admin')) {
      setUserRole('admin');
    } else if (path.startsWith('/tech')) {
      setUserRole('tech');
    } else {
      setUserRole('company');
    }
  }

  return { userRole, isLoading };
}
