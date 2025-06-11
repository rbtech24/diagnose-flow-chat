import { supabase } from "@/integrations/supabase/client";
import { SubscriptionPlan, SubscriptionFeatures, SubscriptionLimits } from "@/types/subscription-consolidated";

export class SubscriptionService {
  static async getPlans(): Promise<SubscriptionPlan[]> {
    console.log('SubscriptionService.getPlans() - Fetching plans from database...');
    
    const { data, error } = await supabase
      .from('subscription_plans')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching plans from database:', error);
      throw error;
    }

    console.log('Raw data from database:', data);

    const mappedPlans = data.map(plan => ({
      ...plan,
      features: this.parseFeatures(plan.features),
      limits: this.parseLimits(plan.limits),
      created_at: plan.created_at || new Date().toISOString(),
      updated_at: plan.updated_at || new Date().toISOString()
    }));
    
    console.log('Mapped plans:', mappedPlans);
    return mappedPlans;
  }

  static async createPlan(planData: Omit<SubscriptionPlan, 'id' | 'created_at' | 'updated_at'>): Promise<SubscriptionPlan> {
    console.log('SubscriptionService.createPlan() - Creating plan:', planData);
    
    const { data, error } = await supabase
      .from('subscription_plans')
      .insert({
        name: planData.name,
        description: planData.description,
        price_monthly: planData.price_monthly,
        price_yearly: planData.price_yearly,
        features: planData.features as any,
        limits: planData.limits as any,
        is_active: planData.is_active,
        recommended: planData.recommended || false,
        trial_period: planData.trial_period || 14
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating plan in database:', error);
      throw error;
    }

    console.log('Plan created successfully in database:', data);

    const createdPlan = {
      ...data,
      features: this.parseFeatures(data.features),
      limits: this.parseLimits(data.limits),
      created_at: data.created_at || new Date().toISOString(),
      updated_at: data.updated_at || new Date().toISOString()
    };
    
    console.log('Returning created plan:', createdPlan);
    return createdPlan;
  }

  static async updatePlan(planId: string, planData: Partial<SubscriptionPlan>): Promise<SubscriptionPlan> {
    console.log('SubscriptionService.updatePlan() - Updating plan:', planId, planData);
    
    const { data, error } = await supabase
      .from('subscription_plans')
      .update({
        name: planData.name,
        description: planData.description,
        price_monthly: planData.price_monthly,
        price_yearly: planData.price_yearly,
        features: planData.features as any,
        limits: planData.limits as any,
        is_active: planData.is_active,
        recommended: planData.recommended,
        trial_period: planData.trial_period,
        updated_at: new Date().toISOString()
      })
      .eq('id', planId)
      .select()
      .single();

    if (error) {
      console.error('Error updating plan in database:', error);
      throw error;
    }

    console.log('Plan updated successfully in database:', data);

    return {
      ...data,
      features: this.parseFeatures(data.features),
      limits: this.parseLimits(data.limits),
      created_at: data.created_at || new Date().toISOString(),
      updated_at: data.updated_at || new Date().toISOString()
    };
  }

  static async togglePlanStatus(planId: string, currentStatus: boolean): Promise<SubscriptionPlan> {
    console.log('SubscriptionService.togglePlanStatus() - Toggling plan status:', planId, currentStatus);
    
    const { data, error } = await supabase
      .from('subscription_plans')
      .update({ 
        is_active: !currentStatus,
        updated_at: new Date().toISOString()
      })
      .eq('id', planId)
      .select()
      .single();

    if (error) {
      console.error('Error toggling plan status in database:', error);
      throw error;
    }

    console.log('Plan status toggled successfully in database:', data);

    return {
      ...data,
      features: this.parseFeatures(data.features),
      limits: this.parseLimits(data.limits),
      created_at: data.created_at || new Date().toISOString(),
      updated_at: data.updated_at || new Date().toISOString()
    };
  }

  static async deletePlan(planId: string): Promise<void> {
    console.log('SubscriptionService.deletePlan() - Attempting to delete plan:', planId);
    
    // First, let's check if the plan exists
    const { data: existingPlan, error: fetchError } = await supabase
      .from('subscription_plans')
      .select('id, name')
      .eq('id', planId)
      .single();

    if (fetchError) {
      console.error('Error fetching plan before deletion:', fetchError);
      throw new Error(`Plan not found: ${fetchError.message}`);
    }

    console.log('Plan found before deletion:', existingPlan);

    // Now try to delete it
    const { error } = await supabase
      .from('subscription_plans')
      .delete()
      .eq('id', planId);

    if (error) {
      console.error('Error deleting plan from database:', error);
      throw new Error(`Failed to delete plan: ${error.message}`);
    }
    
    console.log('Plan deleted successfully from database:', planId);

    // Verify deletion
    const { data: checkPlan, error: checkError } = await supabase
      .from('subscription_plans')
      .select('id')
      .eq('id', planId)
      .maybeSingle();

    if (checkError) {
      console.error('Error checking plan deletion:', checkError);
    } else if (checkPlan) {
      console.error('WARNING: Plan still exists after deletion attempt:', checkPlan);
      throw new Error('Plan deletion failed - plan still exists in database');
    } else {
      console.log('Deletion verified - plan no longer exists in database');
    }
  }

  private static parseFeatures(features: any): SubscriptionFeatures {
    if (!features) return {};
    if (typeof features === 'object' && !Array.isArray(features)) {
      return features as SubscriptionFeatures;
    }
    return {};
  }

  private static parseLimits(limits: any): SubscriptionLimits {
    if (!limits) {
      return {
        technicians: 1,
        admins: 1,
        diagnostics_per_day: 10,
        storage_gb: 1,
        workflows: 10,
        api_calls: 1000
      };
    }
    if (typeof limits === 'object' && !Array.isArray(limits)) {
      return {
        technicians: limits.technicians || 1,
        admins: limits.admins || 1,
        diagnostics_per_day: limits.diagnostics_per_day || 10,
        storage_gb: limits.storage_gb || 1,
        workflows: limits.workflows || 10,
        api_calls: limits.api_calls || 1000
      };
    }
    return {
      technicians: 1,
      admins: 1,
      diagnostics_per_day: 10,
      storage_gb: 1,
      workflows: 10,
      api_calls: 1000
    };
  }
}
