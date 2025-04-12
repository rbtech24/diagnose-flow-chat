
import { supabase } from '@/integrations/supabase/client';
import { User } from '@/types/user';

/**
 * Fetch user profile from Supabase
 */
export async function fetchUserProfile(userId: string): Promise<User | null> {
  try {
    const { data, error } = await supabase
      .from('technicians')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }

    if (!data) {
      return null;
    }

    const sessionUser = await supabase.auth.getUser();
    const email = sessionUser.data.user?.email || '';

    return {
      id: userId,
      email,
      // Since 'name' doesn't exist directly, we need to provide a default value
      name: data.name || '', 
      // Cast role to the expected union type
      role: data.role as 'admin' | 'company' | 'tech',
      // Cast status to the expected union type
      status: data.status as 'active' | 'inactive' | 'pending' | 'archived' | 'deleted',
      phone: data.phone,
      // avatar_url doesn't exist, so provide undefined
      avatarUrl: undefined,
      companyId: data.company_id,
      trialEndsAt: undefined, // These fields don't exist in technicians table
      subscriptionStatus: undefined,
      planId: undefined,
      isMainAdmin: false // Default value since it doesn't exist in technicians
    };
  } catch (error) {
    console.error('Error in fetchUserProfile:', error);
    return null;
  }
}

/**
 * Update user profile in Supabase
 */
export async function updateUserProfile(userId: string, updates: Partial<User>): Promise<boolean> {
  try {
    // Convert from camelCase to snake_case for Supabase
    const profileUpdates: any = {};
    
    if (updates.name) profileUpdates.name = updates.name;
    if (updates.phone) profileUpdates.phone = updates.phone;
    if (updates.role) profileUpdates.role = updates.role;
    if (updates.avatarUrl) profileUpdates.avatar_url = updates.avatarUrl;
    if (updates.status) profileUpdates.status = updates.status;
    if (updates.companyId) profileUpdates.company_id = updates.companyId;
    
    const { error } = await supabase
      .from('technicians')
      .update(profileUpdates)
      .eq('id', userId);

    if (error) {
      console.error('Error updating profile:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in updateUserProfile:', error);
    return false;
  }
}

/**
 * Check if a user has a specific role
 */
export async function checkUserRole(userId: string, role: string): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from('technicians')
      .select('role')
      .eq('id', userId)
      .single();

    if (error || !data) {
      return false;
    }

    return data.role === role;
  } catch {
    return false;
  }
}
