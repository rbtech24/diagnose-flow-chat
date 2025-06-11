import { supabase } from "@/integrations/supabase/client";
import { SubscriptionPlan, SubscriptionFeatures, SubscriptionLimits } from "@/types/subscription-consolidated";
import { DemoAuthService } from "./demoAuthService";

export class SubscriptionService {
  // Helper method to check if user is authenticated (works for both demo and real auth)
  private static async checkAuthentication(): Promise<{ isAuthenticated: boolean; userId?: string; error?: string }> {
    // First check if we're in demo mode
    const demoUser = DemoAuthService.getDemoSession();
    if (demoUser) {
      console.log('Demo authentication detected:', demoUser.id);
      return { isAuthenticated: true, userId: demoUser.id };
    }

    // If not demo mode, check Supabase auth
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError) {
        console.error('Supabase authentication error:', authError);
        return { isAuthenticated: false, error: `Authentication failed: ${authError.message}` };
      }
      
      if (!user) {
        console.error('No authenticated user found');
        return { isAuthenticated: false, error: 'You must be logged in to perform this action' };
      }
      
      console.log('Supabase authenticated user:', user.id);
      return { isAuthenticated: true, userId: user.id };
    } catch (error) {
      console.error('Authentication check failed:', error);
      return { isAuthenticated: false, error: 'Authentication check failed' };
    }
  }

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
    
    try {
      // Check authentication (works for both demo and real auth)
      const authCheck = await this.checkAuthentication();
      
      if (!authCheck.isAuthenticated) {
        throw new Error(authCheck.error || 'Authentication required');
      }

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
        console.error('Full error details:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        });
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
      // Check authentication (works for both demo and real auth)
      const authCheck = await this.checkAuthentication();
      
      if (!authCheck.isAuthenticated) {
        throw new Error(authCheck.error || 'Authentication required');
      }

      const updateFields: any = {};
      
      if (planData.name !== undefined) updateFields.name = planData.name;
      if (planData.description !== undefined) updateFields.description = planData.description;
      if (planData.price_monthly !== undefined) updateFields.price_monthly = planData.price_monthly;
      if (planData.price_yearly !== undefined) updateFields.price_yearly = planData.price_yearly;
      if (planData.features !== undefined) updateFields.features = planData.features;
      if (planData.limits !== undefined) updateFields.limits = planData.limits;
      if (planData.is_active !== undefined) updateFields.is_active = planData.is_active;
      if (planData.recommended !== undefined) updateFields.recommended = planData.recommended;
      if (planData.trial_period !== undefined) updateFields.trial_period = planData.trial_period;
      
      updateFields.updated_at = new Date().toISOString();

      const { data, error } = await supabase
        .from('subscription_plans')
        .update(updateFields)
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
      // Check authentication (works for both demo and real auth)
      const authCheck = await this.checkAuthentication();
      
      if (!authCheck.isAuthenticated) {
        throw new Error(authCheck.error || 'Authentication required');
      }

      const { data: updatedPlan, error: updateError } = await supabase
        .from('subscription_plans')
        .update({ 
          is_active: !currentStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', planId)
        .select()
        .single();

      if (updateError) {
        console.error('Error toggling plan status in database:', updateError);
        throw new Error(`Failed to update plan status: ${updateError.message}`);
      }

      if (!updatedPlan) {
        throw new Error('Plan status update failed - no data returned');
      }

      console.log('Plan status toggled successfully in database:', updatedPlan);

      return {
        ...updatedPlan,
        features: this.parseFeatures(updatedPlan.features),
        limits: this.parseLimits(updatedPlan.limits),
        created_at: updatedPlan.created_at || new Date().toISOString(),
        updated_at: updatedPlan.updated_at || new Date().toISOString()
      };
    } catch (error) {
      console.error('SubscriptionService.togglePlanStatus() - Error:', error);
      throw error;
    }
  }

  static async deletePlan(planId: string): Promise<void> {
    console.log('SubscriptionService.deletePlan() - Attempting to delete plan:', planId);
    
    try {
      // Check authentication (works for both demo and real auth)
      const authCheck = await this.checkAuthentication();
      
      if (!authCheck.isAuthenticated) {
        throw new Error(authCheck.error || 'Authentication required');
      }

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

      // Delete the plan
      const { error: deleteError } = await supabase
        .from('subscription_plans')
        .delete()
        .eq('id', planId);

      if (deleteError) {
        console.error('Error deleting plan from database:', deleteError);
        throw new Error(`Failed to delete plan: ${deleteError.message}`);
      }

      console.log('Plan successfully deleted:', planId);
    } catch (error) {
      console.error('SubscriptionService.deletePlan() - Error:', error);
      throw error;
    }
  }

  static async cleanupDuplicatePlans(): Promise<void> {
    console.log('SubscriptionService.cleanupDuplicatePlans() - Starting cleanup...');
    
    try {
      // Check authentication (works for both demo and real auth)
      const authCheck = await this.checkAuthentication();
      
      if (!authCheck.isAuthenticated) {
        throw new Error(authCheck.error || 'Authentication required');
      }

      // Find duplicate plans based on name and keep the most recent one
      const { data: plans, error: fetchError } = await supabase
        .from('subscription_plans')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) {
        console.error('Error fetching plans for cleanup:', fetchError);
        throw new Error(`Failed to fetch plans for cleanup: ${fetchError.message}`);
      }

      if (!plans || plans.length === 0) {
        console.log('No plans found for cleanup');
        return;
      }

      // Group plans by name and keep only the most recent one
      const plansByName = new Map();
      const duplicatesToDelete: string[] = [];

      for (const plan of plans) {
        if (plansByName.has(plan.name)) {
          // This is a duplicate, mark for deletion
          duplicatesToDelete.push(plan.id);
        } else {
          // This is the first (most recent) plan with this name
          plansByName.set(plan.name, plan);
        }
      }

      if (duplicatesToDelete.length === 0) {
        console.log('No duplicate plans found');
        return;
      }

      console.log(`Found ${duplicatesToDelete.length} duplicate plans to delete:`, duplicatesToDelete);

      // Delete duplicate plans
      const { error: deleteError } = await supabase
        .from('subscription_plans')
        .delete()
        .in('id', duplicatesToDelete);

      if (deleteError) {
        console.error('Error deleting duplicate plans:', deleteError);
        throw new Error(`Failed to delete duplicate plans: ${deleteError.message}`);
      }

      console.log(`Successfully deleted ${duplicatesToDelete.length} duplicate plans`);
    } catch (error) {
      console.error('SubscriptionService.cleanupDuplicatePlans() - Error:', error);
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
