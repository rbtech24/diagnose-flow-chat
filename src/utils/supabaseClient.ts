
import { supabase } from '@/integrations/supabase/client';
import { User } from '@/types/user';

/**
 * Fetch user profile from Supabase
 */
export async function fetchUserProfile(userId: string): Promise<User | null> {
  try {
    const { data, error } = await supabase
      .from('profiles')
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
      name: data.name || '',
      role: data.role,
      status: data.status,
      phone: data.phone,
      avatarUrl: data.avatar_url,
      companyId: data.company_id,
      trialEndsAt: data.trial_ends_at ? new Date(data.trial_ends_at) : undefined,
      subscriptionStatus: data.subscription_status,
      planId: data.plan_id,
      isMainAdmin: data.is_main_admin
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
    if (updates.trialEndsAt) profileUpdates.trial_ends_at = updates.trialEndsAt;
    if (updates.subscriptionStatus) profileUpdates.subscription_status = updates.subscriptionStatus;
    if (updates.planId) profileUpdates.plan_id = updates.planId;
    if (updates.isMainAdmin !== undefined) profileUpdates.is_main_admin = updates.isMainAdmin;
    
    const { error } = await supabase
      .from('profiles')
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
      .from('profiles')
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
