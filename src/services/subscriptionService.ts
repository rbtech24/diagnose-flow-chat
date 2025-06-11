
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

    if (!data || data.length === 0) {
      console.log('No plans found in database');
      return [];
    }

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

    if (!allPlans || allPlans.length === 0) {
      console.log('No plans found to cleanup');
      return;
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
    
    try {
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
        throw new Error(`Failed to create plan: ${error.message}`);
      }

      if (!data) {
        throw new Error('Plan creation failed - no data returned');
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
    } catch (error) {
      console.error('SubscriptionService.createPlan() - Error:', error);
      throw error;
    }
  }

  static async updatePlan(planId: string, planData: Partial<SubscriptionPlan>): Promise<SubscriptionPlan> {
    console.log('SubscriptionService.updatePlan() - Updating plan:', planId, planData);
    
    try {
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
        throw new Error(`Failed to update plan: ${error.message}`);
      }

      if (!data) {
        throw new Error('Plan update failed - no data returned');
      }

      console.log('Plan updated successfully in database:', data);

      return {
        ...data,
        features: this.parseFeatures(data.features),
        limits: this.parseLimits(data.limits),
        created_at: data.created_at || new Date().toISOString(),
        updated_at: data.updated_at || new Date().toISOString()
      };
    } catch (error) {
      console.error('SubscriptionService.updatePlan() - Error:', error);
      throw error;
    }
  }

  static async togglePlanStatus(planId: string, currentStatus: boolean): Promise<SubscriptionPlan> {
    console.log('SubscriptionService.togglePlanStatus() - Toggling plan status:', planId, 'from', currentStatus, 'to', !currentStatus);
    
    try {
      // First check if the plan exists
      const { data: existingPlan, error: fetchError } = await supabase
        .from('subscription_plans')
        .select('*')
        .eq('id', planId)
        .maybeSingle();

      if (fetchError) {
        console.error('Error fetching plan for status toggle:', fetchError);
        throw new Error(`Failed to fetch plan: ${fetchError.message}`);
      }

      if (!existingPlan) {
        throw new Error('Plan not found');
      }

      console.log('Found plan for status toggle:', existingPlan);

      // Update the plan status
      const { data, error } = await supabase
        .from('subscription_plans')
        .update({ 
          is_active: !currentStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', planId)
        .select()
        .maybeSingle();

      if (error) {
        console.error('Error toggling plan status in database:', error);
        throw new Error(`Failed to update plan status: ${error.message}`);
      }

      if (!data) {
        throw new Error('Plan status update failed - no data returned');
      }

      console.log('Plan status toggled successfully in database:', data);

      return {
        ...data,
        features: this.parseFeatures(data.features),
        limits: this.parseLimits(data.limits),
        created_at: data.created_at || new Date().toISOString(),
        updated_at: data.updated_at || new Date().toISOString()
      };
    } catch (error) {
      console.error('SubscriptionService.togglePlanStatus() - Error:', error);
      throw error;
    }
  }

  static async deletePlan(planId: string): Promise<void> {
    console.log('SubscriptionService.deletePlan() - Attempting to delete plan:', planId);
    
    try {
      // First, verify the plan exists
      const { data: existingPlan, error: fetchError } = await supabase
        .from('subscription_plans')
        .select('id, name')
        .eq('id', planId)
        .single();

      if (fetchError || !existingPlan) {
        console.error('Plan not found:', fetchError);
        throw new Error('Plan not found in database');
      }

      console.log('Plan found before deletion:', existingPlan);

      // Check for dependent licenses
      const { data: licensesUsingPlan, error: licenseCheckError } = await supabase
        .from('licenses')
        .select('id, company_name')
        .eq('plan_id', planId)
        .limit(5);

      if (licenseCheckError) {
        console.warn('Could not check for dependent licenses:', licenseCheckError);
      } else if (licensesUsingPlan && licensesUsingPlan.length > 0) {
        const companyNames = licensesUsingPlan.map(l => l.company_name).join(', ');
        throw new Error(`Cannot delete plan - it is currently used by ${licensesUsingPlan.length} license(s) (${companyNames})`);
      }

      // Perform the deletion
      const { error: deleteError } = await supabase
        .from('subscription_plans')
        .delete()
        .eq('id', planId);

      if (deleteError) {
        console.error('Error deleting plan from database:', deleteError);
        throw new Error(`Failed to delete plan: ${deleteError.message}`);
      }
      
      // Verify deletion was successful
      const { data: verifyPlan, error: verifyError } = await supabase
        .from('subscription_plans')
        .select('id')
        .eq('id', planId)
        .maybeSingle();

      if (verifyError) {
        console.error('Error verifying plan deletion:', verifyError);
        throw new Error('Could not verify plan deletion');
      }

      if (verifyPlan) {
        console.error('Plan still exists after deletion attempt:', verifyPlan);
        throw new Error('Plan deletion failed - plan still exists in database');
      }

      console.log('Plan successfully deleted and verified:', planId);
    } catch (error) {
      console.error('SubscriptionService.deletePlan() - Error:', error);
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
