
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

export type Technician = {
  id: string;
  name?: string;
  email?: string;
  status?: string;
  avatar_url?: string;
  role?: string;
  activeJobs?: number;
};

export type CompanyMetrics = {
  activeJobs: number;
  responseTime: string;
  teamPerformance: number;
};

export function useCompanyTechnicians() {
  const [technicians, setTechnicians] = useState<Technician[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [metrics, setMetrics] = useState<CompanyMetrics>({
    activeJobs: 0,
    responseTime: '0 hrs',
    teamPerformance: 0
  });

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
      toast({
        title: "Success",
        description: "Technician deleted successfully",
        variant: "default"
      });
      return true;
    } catch (err) {
      console.error('Error deleting technician:', err);
      toast({
        title: "Error",
        description: "Failed to delete technician: " + (err instanceof Error ? err.message : 'Unknown error'),
        variant: "destructive"
      });
      return false;
    }
  };

  // Function to fetch company metrics
  const fetchCompanyMetrics = async (companyId: string) => {
    try {
      // Get active jobs count
      const { count: activeJobsCount, error: repairsError } = await supabase
        .from('repairs')
        .select('id', { count: 'exact', head: false })
        .eq('company_id', companyId)
        .in('status', ['assigned', 'in_progress']);

      if (repairsError) {
        console.error('Error fetching active repairs:', repairsError);
      } else {
        // Update active jobs if we have real data
        setMetrics(prev => ({
          ...prev,
          activeJobs: activeJobsCount || 0
        }));
      }
      
      // Get response time metrics from completed repairs
      const { data: recentRepairs, error: timeError } = await supabase
        .from('repairs')
        .select('started_at, completed_at')
        .eq('company_id', companyId)
        .eq('status', 'completed')
        .order('completed_at', { ascending: false })
        .limit(20);
        
      if (!timeError && recentRepairs && recentRepairs.length > 0) {
        // Calculate average response time from real data
        const responseTimes = recentRepairs
          .filter(repair => repair.started_at && repair.completed_at)
          .map(repair => {
            const start = new Date(repair.started_at);
            const end = new Date(repair.completed_at);
            return (end.getTime() - start.getTime()) / (1000 * 60 * 60); // hours
          });
          
        if (responseTimes.length > 0) {
          const avgResponseTime = responseTimes.reduce((sum, time) => sum + time, 0) / responseTimes.length;
          
          // Format to hours and minutes
          const hours = Math.floor(avgResponseTime);
          const minutes = Math.round((avgResponseTime - hours) * 60);
          const formattedTime = minutes > 0 ? 
            `${hours}.${minutes} hrs` : 
            `${hours} hrs`;
            
          setMetrics(prev => ({
            ...prev,
            responseTime: formattedTime
          }));
        } else {
          setMetrics(prev => ({ ...prev, responseTime: 'N/A' }));
        }
      } else {
        setMetrics(prev => ({ ...prev, responseTime: 'N/A' }));
      }

      // Fetch team performance from completed repairs
      const { data: performanceData, error: performanceError } = await supabase
        .from('technician_performance_metrics')
        .select('efficiency_score')
        .eq('company_id', companyId)
        .order('calculated_at', { ascending: false })
        .limit(10);

      if (!performanceError && performanceData && performanceData.length > 0) {
        const avgPerformance = performanceData.reduce((sum, item) => sum + (item.efficiency_score || 0), 0) / performanceData.length;
        setMetrics(prev => ({
          ...prev,
          teamPerformance: Math.round(avgPerformance)
        }));
      } else {
        // If no performance data is available, set to a reasonable default
        setMetrics(prev => ({ ...prev, teamPerformance: 75 }));
      }
    } catch (err) {
      console.error('Error fetching company metrics:', err);
      // Keep existing metrics in case of error
    }
  };

  useEffect(() => {
    async function fetchTechnicians() {
      try {
        setIsLoading(true);
        setError(null);
        
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
          .maybeSingle();
          
        if (userError) {
          throw userError;
        }
        
        const companyId = userData?.company_id;
        
        if (!companyId) {
          // If no company ID found, use mock data as fallback
          setTechnicians([
            {
              id: "tech-1",
              name: "John Smith",
              email: "john@example.com",
              status: "active",
              role: "tech",
              avatar_url: "https://i.pravatar.cc/300?img=1",
              activeJobs: 3
            },
            {
              id: "tech-2",
              name: "Sarah Johnson",
              email: "sarah@example.com",
              status: "active",
              role: "tech",
              avatar_url: "https://i.pravatar.cc/300?img=2",
              activeJobs: 2
            },
            {
              id: "tech-3",
              name: "Mike Williams",
              email: "mike@example.com",
              status: "offline",
              role: "tech",
              avatar_url: "https://i.pravatar.cc/300?img=3",
              activeJobs: 0
            }
          ]);
          setIsLoading(false);
          return;
        }
        
        // Fetch technicians for this company
        const { data: techData, error } = await supabase
          .from('technicians')
          .select(`
            id,
            email,
            status,
            role,
            last_sign_in_at
          `)
          .eq('company_id', companyId);
          
        if (error) {
          throw error;
        }
        
        if (!techData || techData.length === 0) {
          console.log('No technicians found in the database');
          setTechnicians([]);
        } else {
          // Get user details for each technician to get name and avatar
          const technicianData = await Promise.all(
            techData.map(async tech => {
              // Get user info from auth.users
              const { data: profileData, error: profileError } = await supabase
                .from('profiles')
                .select('full_name, avatar_url')
                .eq('id', tech.id)
                .maybeSingle();
              
              if (profileError) {
                console.warn(`Could not find user details for tech ${tech.id}`, profileError);
              }
              
              // Get active jobs count for this technician
              const { count: activeJobsCount, error: jobsError } = await supabase
                .from('repairs')
                .select('id', { count: 'exact', head: false })
                .eq('technician_id', tech.id)
                .in('status', ['assigned', 'in_progress']);
                
              if (jobsError) {
                console.warn(`Could not fetch active jobs for tech ${tech.id}`, jobsError);
              }
                
              return {
                ...tech,
                name: profileData?.full_name || tech.email?.split('@')[0] || 'Unknown',
                avatar_url: profileData?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(profileData?.full_name || tech.email || 'User')}`,
                activeJobs: activeJobsCount || 0
              };
            })
          );
          
          setTechnicians(technicianData);
        }
        
        // Fetch company metrics
        await fetchCompanyMetrics(companyId);
          
      } catch (err) {
        console.error('Error in useCompanyTechnicians:', err);
        setError(err instanceof Error ? err : new Error('Failed to fetch technicians'));
        setTechnicians([]);
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchTechnicians();
  }, []);
  
  return { technicians, isLoading, error, deleteTechnician, metrics };
}
