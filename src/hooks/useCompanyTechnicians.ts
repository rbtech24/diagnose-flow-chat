
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { TechnicianWithUserInfo } from '@/types/technician';

interface CompanyMetrics {
  responseTime: string;
  teamPerformance: number;
  activeJobs: number;
}

interface UseCompanyTechniciansReturn {
  technicians: TechnicianWithUserInfo[];
  isLoading: boolean;
  error: Error | null;
  deleteTechnician: (id: string) => Promise<boolean>;
  metrics: CompanyMetrics;
}

interface UseCompanyTechniciansProps {
  companyId?: string;
  includeAdmins?: boolean;
}

export function useCompanyTechnicians({ 
  companyId, 
  includeAdmins = false 
}: UseCompanyTechniciansProps = {}): UseCompanyTechniciansReturn {
  const [technicians, setTechnicians] = useState<TechnicianWithUserInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [metrics, setMetrics] = useState<CompanyMetrics>({
    responseTime: 'N/A',
    teamPerformance: 0,
    activeJobs: 0
  });

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
        
        // Using a direct query without .in() to avoid type issues
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('id, name, avatar_url')
          .filter('id', 'in', `(${techIds.map(id => `'${id}'`).join(',')})`);

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
        const mergedData: TechnicianWithUserInfo[] = techData.map(tech => {
          const userInfo = userMap.get(tech.id);
          // Create a merged object with both sets of properties
          const technician: TechnicianWithUserInfo = {
            ...tech,
            name: userInfo?.name || tech.email?.split('@')[0] || 'Unknown',
            avatar_url: userInfo?.avatar_url,
            // Map properties to expected types
            companyId: tech.company_id || '',
            avatarUrl: userInfo?.avatar_url,
            activeJobs: 0 // Default value
          };
          return technician;
        });

        setTechnicians(mergedData);
        
        // Fetch company metrics
        await fetchMetrics(companyId);
      } catch (err) {
        console.error('Error in useCompanyTechnicians:', err);
        setError(err instanceof Error ? err : new Error('Unknown error occurred'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchTechnicians();
  }, [companyId, includeAdmins]);

  const fetchMetrics = async (companyId: string) => {
    try {
      // Get active jobs
      const { count: activeJobs } = await supabase
        .from('repairs')
        .select('*', { count: 'exact', head: true })
        .eq('company_id', companyId)
        .in('status', ['scheduled', 'in_progress']);

      // Get technician performance
      const { data: performanceMetrics } = await supabase
        .from('technician_performance_metrics')
        .select('*')
        .eq('technician_id', companyId);

      // Calculate metrics
      let avgResponseTime = 'N/A';
      let teamPerformance = 0;

      if (performanceMetrics && performanceMetrics.length > 0) {
        // Calculate average response time
        const totalResponseTime = performanceMetrics.reduce((sum, metric) => {
          const time = metric.average_service_time ? Number(metric.average_service_time) : 0;
          return sum + time;
        }, 0);
        
        const avgHours = Math.floor(totalResponseTime / performanceMetrics.length / 3600);
        avgResponseTime = `${avgHours}hrs`;

        // Calculate team performance
        const totalPerformance = performanceMetrics.reduce((sum, metric) => {
          return sum + (metric.efficiency_score || 0);
        }, 0);
        
        teamPerformance = Math.round(totalPerformance / performanceMetrics.length);
      }

      setMetrics({
        responseTime: avgResponseTime,
        teamPerformance,
        activeJobs: activeJobs || 0
      });
    } catch (error) {
      console.error('Error fetching company metrics:', error);
    }
  };

  const deleteTechnician = async (id: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('technicians')
        .delete()
        .eq('id', id);
      
      if (error) {
        throw error;
      }
      
      setTechnicians(technicians.filter(tech => tech.id !== id));
      toast.success('Technician removed successfully');
      return true;
    } catch (err) {
      console.error('Error deleting technician:', err);
      toast.error('Failed to delete technician');
      return false;
    }
  };

  return { technicians, isLoading, error, deleteTechnician, metrics };
}

// Add import for toast
import { toast } from 'sonner';
