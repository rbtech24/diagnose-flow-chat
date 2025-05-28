
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export function useUserRole() {
  const [userRole, setUserRole] = useState<'admin' | 'company' | 'tech'>('tech');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function getCurrentUser() {
      try {
        setIsLoading(true);
        
        // Get authenticated user
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        
        if (userError || !user) {
          console.error('Error getting user:', userError);
          setUserRole('tech'); // Default fallback
          setIsLoading(false);
          return;
        }

        // Fetch user role from technicians table
        const { data: technicianData, error: techError } = await supabase
          .from('technicians')
          .select('role')
          .eq('id', user.id)
          .single();

        if (techError) {
          console.error('Error fetching technician role:', techError);
          // Check user metadata as fallback
          const roleFromMeta = user.user_metadata?.role || user.app_metadata?.role;
          if (roleFromMeta && ['admin', 'company', 'tech'].includes(roleFromMeta)) {
            setUserRole(roleFromMeta as 'admin' | 'company' | 'tech');
          } else {
            setUserRole('tech'); // Safe fallback
          }
        } else {
          // Map database roles to UI roles
          const dbRole = technicianData.role;
          let uiRole: 'admin' | 'company' | 'tech' = 'tech';
          
          switch (dbRole) {
            case 'admin':
              uiRole = 'admin';
              break;
            case 'company_admin':
              uiRole = 'company';
              break;
            case 'technician':
            case 'tech':
            default:
              uiRole = 'tech';
              break;
          }
          
          setUserRole(uiRole);
        }
      } catch (error) {
        console.error('Error determining user role:', error);
        setUserRole('tech'); // Safe fallback
      } finally {
        setIsLoading(false);
      }
    }

    getCurrentUser();
  }, []);

  return { userRole, isLoading };
}
