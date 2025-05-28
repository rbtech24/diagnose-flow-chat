
import { supabase } from "@/integrations/supabase/client";
import { SubscriptionPlan } from "@/types/subscription-consolidated";

export class SubscriptionService {
  static async getPlans(): Promise<SubscriptionPlan[]> {
    const { data, error } = await supabase
      .from('subscription_plans')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) throw error;

    return data.map(plan => ({
      ...plan,
      features: plan.features || {},
      limits: plan.limits || {
        technicians: 1,
        admins: 1,
        diagnostics_per_day: 10,
        storage_gb: 1,
        workflows: 10,
        api_calls: 1000
      }
    }));
  }

  static async createPlan(planData: Omit<SubscriptionPlan, 'id' | 'created_at' | 'updated_at'>): Promise<SubscriptionPlan> {
    const { data, error } = await supabase
      .from('subscription_plans')
      .insert({
        name: planData.name,
        description: planData.description,
        price_monthly: planData.price_monthly,
        price_yearly: planData.price_yearly,
        features: planData.features,
        limits: planData.limits,
        is_active: planData.is_active,
        recommended: planData.recommended || false,
        trial_period: planData.trial_period || 14
      })
      .select()
      .single();

    if (error) throw error;

    return {
      ...data,
      features: data.features || {},
      limits: data.limits || {}
    };
  }

  static async updatePlan(planId: string, planData: Partial<SubscriptionPlan>): Promise<SubscriptionPlan> {
    const { data, error } = await supabase
      .from('subscription_plans')
      .update({
        name: planData.name,
        description: planData.description,
        price_monthly: planData.price_monthly,
        price_yearly: planData.price_yearly,
        features: planData.features,
        limits: planData.limits,
        is_active: planData.is_active,
        recommended: planData.recommended,
        trial_period: planData.trial_period,
        updated_at: new Date().toISOString()
      })
      .eq('id', planId)
      .select()
      .single();

    if (error) throw error;

    return {
      ...data,
      features: data.features || {},
      limits: data.limits || {}
    };
  }

  static async togglePlanStatus(planId: string, currentStatus: boolean): Promise<SubscriptionPlan> {
    const { data, error } = await supabase
      .from('subscription_plans')
      .update({ 
        is_active: !currentStatus,
        updated_at: new Date().toISOString()
      })
      .eq('id', planId)
      .select()
      .single();

    if (error) throw error;

    return {
      ...data,
      features: data.features || {},
      limits: data.limits || {}
    };
  }

  static async deletePlan(planId: string): Promise<void> {
    const { error } = await supabase
      .from('subscription_plans')
      .delete()
      .eq('id', planId);

    if (error) throw error;
  }
}
