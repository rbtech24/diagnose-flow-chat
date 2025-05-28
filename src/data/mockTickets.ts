
import { User } from "@/types/user";
import { supabase } from "@/integrations/supabase/client";
import { SupabaseIntegration } from "@/utils/supabaseIntegration";

// Real data fetching implementation for current user
export const getCurrentUser = async (): Promise<User | null> => {
  try {
    console.log('Fetching current user from database...');
    
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return null;
    }

    const result = await SupabaseIntegration.safeQuery(async () => {
      return await supabase
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
        .eq('id', user.id)
        .single();
    });

    if (!result.success || !result.data) {
      console.error('Failed to fetch current user:', result.error);
      return null;
    }

    const userData: User = {
      id: result.data.id,
      name: result.data.name || result.data.email?.split('@')[0] || 'Unknown',
      email: result.data.email || '',
      role: (result.data.role as 'admin' | 'company' | 'tech') || 'tech',
      companyId: result.data.company_id || '',
      status: result.data.status || 'active',
      avatarUrl: result.data.avatar_url,
      activeJobs: 0
    };

    console.log('Successfully fetched current user');
    return userData;
  } catch (error) {
    console.error('Error fetching current user:', error);
    return null;
  }
};

export const currentUser: User & { avatar_url?: string } = {
  id: "demo-user-id",
  name: "Demo User",
  email: "demo@example.com",
  role: "company",
  companyId: "demo-company-id",
  status: "active",
  avatar_url: "",
  activeJobs: 0
};
