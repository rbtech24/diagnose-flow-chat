
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
          // Get the user profile data which should include the role
          const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single();
            
          if (profile) {
            setUserRole(profile.role);
          } else {
            // Fallback to mock role - for demo purposes
            // In a real app, you would use a more secure method
            const path = window.location.pathname;
            if (path.startsWith('/admin')) {
              setUserRole('admin');
            } else if (path.startsWith('/tech')) {
              setUserRole('tech');
            } else {
              setUserRole('company');
            }
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
