
import { User } from "@/types/user";
import { supabase } from "@/integrations/supabase/client";
import { SupabaseIntegration } from "@/utils/supabaseIntegration";

// Real data fetching implementation
export const getTechnicians = async (companyId?: string): Promise<User[]> => {
  try {
    console.log('Fetching technicians from database...');
    
    const result = await SupabaseIntegration.safeQuery(async () => {
      let query = supabase
        .from('technicians')
        .select(`
          id,
          email,
          role,
          company_id,
          status,
          phone,
          avatar_url,
          name,
          last_sign_in_at,
          created_at,
          updated_at
        `)
        .eq('status', 'active');
      
      if (companyId) {
        query = query.eq('company_id', companyId);
      }
      
      return await query;
    });

    if (!result.success) {
      console.error('Failed to fetch technicians:', result.error);
      return [];
    }

    // Transform database data to User type
    const technicians: User[] = (result.data || []).map(tech => ({
      id: tech.id,
      name: tech.name || tech.email?.split('@')[0] || 'Unknown',
      email: tech.email || '',
      role: (tech.role as 'admin' | 'company' | 'tech') || 'tech',
      companyId: tech.company_id || '',
      status: tech.status || 'active',
      avatarUrl: tech.avatar_url,
      activeJobs: 0 // This would need to be calculated from repairs table
    }));

    console.log(`Successfully fetched ${technicians.length} technicians`);
    return technicians;
  } catch (error) {
    console.error('Error fetching technicians:', error);
    return [];
  }
};

// Real-time subscription for technicians
export const subscribeTechniciansUpdates = (
  companyId: string,
  onUpdate: (technicians: User[]) => void
) => {
  console.log('Setting up real-time subscription for technicians...');
  
  return SupabaseIntegration.handleRealtimeSubscription(
    'technicians',
    async () => {
      const updatedTechnicians = await getTechnicians(companyId);
      onUpdate(updatedTechnicians);
    },
    'UPDATE'
  );
};
