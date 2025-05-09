
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { mockTechnicians } from '@/data/mockTechnicians';
import { toast } from 'sonner';

export type Technician = {
  id: string;
  name?: string;
  email?: string;
  status?: string;
  avatar_url?: string;
  role?: string;
  activeJobs?: number;
};

export function useCompanyTechnicians() {
  const [technicians, setTechnicians] = useState<Technician[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  // Function to delete a technician
  const deleteTechnician = async (technicianId: string) => {
    try {
      // Get the current user's company ID first to ensure proper authorization
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('No authenticated user found');
      }
      
      // Get user details to find company ID
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('company_id')
        .eq('id', user.id)
        .single();
        
      if (userError) {
        throw userError;
      }
      
      if (!userData?.company_id) {
        throw new Error('No company ID found for user');
      }
      
      // Delete the technician
      const { error: deleteError } = await supabase
        .from('technicians')
        .delete()
        .eq('id', technicianId)
        .eq('company_id', userData.company_id);
        
      if (deleteError) {
        throw deleteError;
      }
      
      // Update the local state after successful deletion
      setTechnicians(technicians.filter(tech => tech.id !== technicianId));
      
      // Show success message
      toast.success("Technician deleted successfully");
      return true;
    } catch (err) {
      console.error('Error deleting technician:', err);
      toast.error("Failed to delete technician");
      return false;
    }
  };

  useEffect(() => {
    async function fetchTechnicians() {
      try {
        setIsLoading(true);
        setError(null);
        
        try {
          // Get the current user's company ID
          const { data: { user } } = await supabase.auth.getUser();
          
          if (!user) {
            throw new Error('No authenticated user found');
          }
          
          // Get user details to find company ID
          const { data: userData, error: userError } = await supabase
            .from('users')
            .select('company_id')
            .eq('id', user.id)
            .single();
            
          if (userError) {
            throw userError;
          }
          
          if (!userData?.company_id) {
            throw new Error('No company ID found for user');
          }
          
          // Fetch technicians for this company
          const { data, error } = await supabase
            .from('technicians')
            .select(`
              id,
              email,
              status,
              role,
              last_sign_in_at
            `)
            .eq('company_id', userData.company_id);
            
          if (error) {
            throw error;
          }
          
          // Get user details for each technician to get name and avatar
          const technicianData = await Promise.all(
            data.map(async tech => {
              // Get user info from auth.users
              const { data: authUser } = await supabase
                .from('users')
                .select('name, avatar_url')
                .eq('id', tech.id)
                .single();
              
              // Get active jobs count
              const { count: activeJobsCount } = await supabase
                .from('repairs')
                .select('id', { count: 'exact', head: false })
                .eq('technician_id', tech.id)
                .in('status', ['assigned', 'in_progress']);
                
              return {
                ...tech,
                name: authUser?.name || tech.email?.split('@')[0] || 'Unknown',
                avatar_url: authUser?.avatar_url || null,
                activeJobs: activeJobsCount || 0
              };
            })
          );
          
          setTechnicians(technicianData);
        } catch (err) {
          console.error('Error fetching technicians from API, using mock data:', err);
          // Fall back to mock data if API calls fail
          setTechnicians(mockTechnicians);
        }
      } catch (err) {
        console.error('Error in useCompanyTechnicians:', err);
        setError(err instanceof Error ? err : new Error('Failed to fetch technicians'));
        setTechnicians(mockTechnicians);
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchTechnicians();
  }, []);
  
  return { technicians, isLoading, error, deleteTechnician };
}
