
import { SubscriptionPlan, License, Payment } from "@/types/subscription";
import { supabase } from "@/integrations/supabase/client";
import { SupabaseIntegration } from "@/utils/supabaseIntegration";

// Real data fetching implementation for subscription plans
export const getSubscriptionPlans = async (): Promise<SubscriptionPlan[]> => {
  try {
    console.log('Fetching subscription plans from database...');
    
    const result = await SupabaseIntegration.safeQuery(async () => {
      return await supabase
        .from('subscription_plans')
        .select('*')
        .eq('is_active', true)
        .order('price', { ascending: true });
    });

    if (!result.success) {
      console.error('Failed to fetch subscription plans:', result.error);
      return [];
    }

    console.log(`Successfully fetched ${result.data?.length || 0} subscription plans`);
    return result.data || [];
  } catch (error) {
    console.error('Error fetching subscription plans:', error);
    return [];
  }
};

// Real data fetching implementation for licenses
export const getLicenses = async (companyId?: string): Promise<License[]> => {
  try {
    console.log('Fetching licenses from database...');
    
    const result = await SupabaseIntegration.safeQuery(async () => {
      let query = supabase
        .from('licenses')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (companyId) {
        query = query.eq('company_id', companyId);
      }
      
      return await query;
    });

    if (!result.success) {
      console.error('Failed to fetch licenses:', result.error);
      return [];
    }

    console.log(`Successfully fetched ${result.data?.length || 0} licenses`);
    return result.data || [];
  } catch (error) {
    console.error('Error fetching licenses:', error);
    return [];
  }
};

// Real data fetching implementation for payments
export const getPayments = async (companyId?: string): Promise<Payment[]> => {
  try {
    console.log('Fetching payments from database...');
    
    const result = await SupabaseIntegration.safeQuery(async () => {
      let query = supabase
        .from('payments')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (companyId) {
        query = query.eq('company_id', companyId);
      }
      
      return await query;
    });

    if (!result.success) {
      console.error('Failed to fetch payments:', result.error);
      return [];
    }

    console.log(`Successfully fetched ${result.data?.length || 0} payments`);
    return result.data || [];
  } catch (error) {
    console.error('Error fetching payments:', error);
    return [];
  }
};
