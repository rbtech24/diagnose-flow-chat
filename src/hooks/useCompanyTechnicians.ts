
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { TechnicianProfile } from '@/types/technician-enhanced';
import { SupabaseIntegration } from '@/utils/supabaseIntegration';

interface UseCompanyTechniciansReturn {
  technicians: TechnicianProfile[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  addTechnician: (technician: Partial<TechnicianProfile>) => Promise<boolean>;
  updateTechnician: (id: string, updates: Partial<TechnicianProfile>) => Promise<boolean>;
  deleteTechnician: (id: string) => Promise<boolean>;
}

export function useCompanyTechnicians(companyId?: string): UseCompanyTechniciansReturn {
  const [technicians, setTechnicians] = useState<TechnicianProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTechnicians = async () => {
    if (!companyId) {
      setTechnicians([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await SupabaseIntegration.safeQuery(async () => {
        return await supabase
          .from('technicians')
          .select(`
            id,
            email,
            role,
            status,
            company_id,
            phone,
            is_independent,
            available_for_hire,
            hourly_rate,
            last_sign_in_at,
            created_at,
            updated_at
          `)
          .eq('company_id', companyId)
          .order('created_at', { ascending: false });
      });

      if (result.success && result.data) {
        const transformedTechnicians: TechnicianProfile[] = result.data.map(tech => ({
          ...tech,
          role: tech.role as 'admin' | 'company_admin' | 'technician',
          status: tech.status as 'active' | 'inactive' | 'pending',
          full_name: tech.email?.split('@')[0] || 'Unknown',
          avatar_url: undefined
        }));
        setTechnicians(transformedTechnicians);
      } else {
        setError(result.error?.message || 'Failed to fetch technicians');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const addTechnician = async (technicianData: Partial<TechnicianProfile>): Promise<boolean> => {
    if (!companyId) return false;

    const result = await SupabaseIntegration.safeTechnicianInsert({
      ...technicianData,
      company_id: companyId,
      status: 'active'
    });

    if (result.success) {
      await fetchTechnicians();
      return true;
    } else {
      setError(result.error?.message || 'Failed to add technician');
      return false;
    }
  };

  const updateTechnician = async (id: string, updates: Partial<TechnicianProfile>): Promise<boolean> => {
    const result = await SupabaseIntegration.safeTechnicianUpdate(id, updates);

    if (result.success) {
      await fetchTechnicians();
      return true;
    } else {
      setError(result.error?.message || 'Failed to update technician');
      return false;
    }
  };

  const deleteTechnician = async (id: string): Promise<boolean> => {
    const result = await SupabaseIntegration.safeTechnicianDelete(id);

    if (result.success) {
      await fetchTechnicians();
      return true;
    } else {
      setError(result.error?.message || 'Failed to delete technician');
      return false;
    }
  };

  useEffect(() => {
    fetchTechnicians();
  }, [companyId]);

  return {
    technicians,
    isLoading,
    error,
    refetch: fetchTechnicians,
    addTechnician,
    updateTechnician,
    deleteTechnician
  };
}
