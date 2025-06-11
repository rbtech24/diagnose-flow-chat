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

    // Remove duplicates by keeping the earliest created plan for each name
    const uniquePlans = data.reduce((acc: any[], plan: any) => {
      const existing = acc.find(p => p.name === plan.name);
      if (!existing) {
        acc.push(plan);
      } else if (new Date(plan.created_at) < new Date(existing.created_at)) {
        // Replace with earlier created plan
        const index = acc.findIndex(p => p.name === plan.name);
        acc[index] = plan;
      }
      return acc;
    }, []);

    const mappedPlans = uniquePlans.map(plan => ({
      ...plan,
      features: this.parseFeatures(plan.features),
      limits: this.parseLimits(plan.limits),
      created_at: plan.created_at || new Date().toISOString(),
      updated_at: plan.updated_at || new Date().toISOString()
    }));
    
    console.log('Mapped plans after deduplication:', mappedPlans);
    return mappedPlans;
  }

  static async cleanupDuplicatePlans(): Promise<void> {
    console.log('SubscriptionService.cleanupDuplicatePlans() - Starting cleanup...');
    
    const { data: allPlans, error } = await supabase
      .from('subscription_plans')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching plans for cleanup:', error);
      throw error;
    }

    // Group plans by name
    const planGroups: { [key: string]: any[] } = {};
    allPlans.forEach(plan => {
      if (!planGroups[plan.name]) {
        planGroups[plan.name] = [];
      }
      planGroups[plan.name].push(plan);
    });

    // Delete duplicates (keep the earliest created one)
    for (const [planName, plans] of Object.entries(planGroups)) {
      if (plans.length > 1) {
        console.log(`Found ${plans.length} duplicates for plan: ${planName}`);
        
        // Sort by created_at and keep the first one
        plans.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
        const toKeep = plans[0];
        const toDelete = plans.slice(1);

        console.log(`Keeping plan ID: ${toKeep.id}, deleting ${toDelete.length} duplicates`);

        // Delete duplicates
        for (const duplicate of toDelete) {
          const { error: deleteError } = await supabase
            .from('subscription_plans')
            .delete()
            .eq('id', duplicate.id);

          if (deleteError) {
            console.error(`Error deleting duplicate plan ${duplicate.id}:`, deleteError);
          } else {
            console.log(`Successfully deleted duplicate plan ${duplicate.id}`);
          }
        }
      }
    }

    console.log('Cleanup completed');
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
    
    try {
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

      // Check if there are any licenses using this plan - with better error handling
      try {
        const { data: licensesUsingPlan, error: licenseCheckError } = await supabase
          .from('licenses')
          .select('id')
          .eq('plan_id', planId)
          .limit(1);

        if (licenseCheckError) {
          console.error('Error checking for licenses using this plan:', licenseCheckError);
          // If we can't check dependencies, still allow deletion but warn
          console.warn('Could not verify plan dependencies, proceeding with deletion');
        } else if (licensesUsingPlan && licensesUsingPlan.length > 0) {
          throw new Error('Cannot delete plan - it is currently in use by active licenses');
        }
      } catch (dependencyError) {
        console.error('Dependency check failed:', dependencyError);
        // If dependency check fails, we'll still proceed with deletion
        // This prevents the deletion from being blocked by database issues
        console.warn('Proceeding with deletion despite dependency check failure');
      }

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
        throw new Error('Failed to verify plan deletion');
      } else if (checkPlan) {
        console.error('WARNING: Plan still exists after deletion attempt:', checkPlan);
        throw new Error('Plan deletion failed - plan still exists in database');
      } else {
        console.log('Deletion verified - plan no longer exists in database');
      }
    } catch (error) {
      console.error('Delete plan error:', error);
      throw error;
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
