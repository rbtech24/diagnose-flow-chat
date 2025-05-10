
// Fix the deep type instantiation issue by modifying the query structure
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { TechnicianWithUserInfo } from '@/types/technician';

interface UseCompanyTechniciansProps {
  companyId?: string;
  includeAdmins?: boolean;
}

export function useCompanyTechnicians({ 
  companyId, 
  includeAdmins = false 
}: UseCompanyTechniciansProps) {
  const [technicians, setTechnicians] = useState<TechnicianWithUserInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!companyId) {
      setTechnicians([]);
      setIsLoading(false);
      return;
    }

    const fetchTechnicians = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Step 1: Fetch base technician data
        const techQuery = supabase
          .from('technicians')
          .select('*')
          .eq('company_id', companyId);
        
        if (!includeAdmins) {
          techQuery.eq('role', 'tech');
        }

        const { data: techData, error: techError } = await techQuery;

        if (techError) {
          throw new Error(`Error fetching technicians: ${techError.message}`);
        }

        if (!techData || techData.length === 0) {
          setTechnicians([]);
          setIsLoading(false);
          return;
        }

        // Step 2: Fetch user data for these technicians
        const techIds = techData.map(tech => tech.id);
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('id, name, avatar_url')
          .in('id', techIds);

        if (userError) {
          console.warn(`Error fetching user details: ${userError.message}`);
          // Continue with available data
        }

        // Create a mapping of user data
        const userMap = new Map();
        if (userData && userData.length > 0) {
          userData.forEach(user => {
            userMap.set(user.id, {
              name: user.name,
              avatar_url: user.avatar_url
            });
          });
        }

        // Merge technician and user data
        const mergedData = techData.map(tech => {
          const userInfo = userMap.get(tech.id);
          return {
            ...tech,
            name: userInfo?.name || tech.email?.split('@')[0] || 'Unknown',
            avatar_url: userInfo?.avatar_url
          } as TechnicianWithUserInfo;
        });

        setTechnicians(mergedData);
      } catch (err) {
        console.error('Error in useCompanyTechnicians:', err);
        setError(err instanceof Error ? err : new Error('Unknown error occurred'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchTechnicians();
  }, [companyId, includeAdmins]);

  return { technicians, isLoading, error };
}
