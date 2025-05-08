
import { useState, useEffect } from 'react';
import { User } from '@/types/user';
import { supabase } from '@/integrations/supabase/client';

export function useUserRole() {
  const [userRole, setUserRole] = useState<'admin' | 'company' | 'tech'>('company');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function getCurrentUser() {
      try {
        // Attempt to get the user from Supabase
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          // Since we can't fetch from 'profiles' table directly, 
          // we'll use a fallback method to determine role.
          // In a production app, this would come from a valid table in your database

          // Fallback to determining role from URL
          // This is not secure and is only for demo purposes
          const path = window.location.pathname;
          if (path.startsWith('/admin')) {
            setUserRole('admin');
          } else if (path.startsWith('/tech')) {
            setUserRole('tech');
          } else {
            setUserRole('company');
          }
        } else {
          // No authenticated user - fallback to determining role from URL
          // This is not secure and is only for demo purposes
          const path = window.location.pathname;
          if (path.startsWith('/admin')) {
            setUserRole('admin');
          } else if (path.startsWith('/tech')) {
            setUserRole('tech');
          } else {
            setUserRole('company');
          }
        }
      } catch (error) {
        console.error('Error getting user role:', error);
        // Fallback to basic role determination
        const path = window.location.pathname;
        if (path.startsWith('/admin')) {
          setUserRole('admin');
        } else if (path.startsWith('/tech')) {
          setUserRole('tech');
        } else {
          setUserRole('company');
        }
      } finally {
        setIsLoading(false);
      }
    }

    getCurrentUser();
  }, []);

  return { userRole, isLoading };
}
