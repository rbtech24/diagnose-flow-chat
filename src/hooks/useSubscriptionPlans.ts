
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { formatDateForSupabase } from "@/utils/dateUtils";

export interface SubscriptionPlan {
  id: string;
  name: string;
  price_monthly: number;
  price_yearly: number;
  features: string[];
  description?: string;
  recommended?: boolean;
  trial_period: number;
  limits?: Record<string, any>;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export function useSubscriptionPlans() {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchPlans = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('subscription_plans')
        .select('*')
        .eq('is_active', true)
        .order('price_monthly', { ascending: true });

      if (error) throw error;
      
      // Transform the data to ensure proper typing
      const formattedData = data?.map(plan => {
        // Ensure features is always a string array
        let featuresArray: string[] = [];
        
        if (Array.isArray(plan.features)) {
          featuresArray = plan.features;
        } else if (typeof plan.features === 'string') {
          try {
            const parsed = JSON.parse(plan.features);
            featuresArray = Array.isArray(parsed) ? parsed : [plan.features];
          } catch {
            featuresArray = [plan.features];
          }
        } else if (plan.features && typeof plan.features === 'object') {
          featuresArray = Object.values(plan.features).map(String);
        }
        
        // Ensure limits is always a Record<string, any>
        let limitsObj: Record<string, any> = {};
        
        if (plan.limits && typeof plan.limits === 'object') {
          try {
            limitsObj = plan.limits;
          } catch {
            limitsObj = {};
          }
        } else if (typeof plan.limits === 'string') {
          try {
            limitsObj = JSON.parse(plan.limits);
          } catch {
            limitsObj = {};
          }
        }
        
        return {
          ...plan,
          features: featuresArray,
          limits: limitsObj
        } as SubscriptionPlan;
      }) || [];
      
      setPlans(formattedData);
    } catch (error) {
      console.error('Error fetching subscription plans:', error);
      toast({
        title: "Error",
        description: "Failed to load subscription plans",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const createPlan = async (planData: Omit<SubscriptionPlan, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      // Ensure features is properly formatted for database
      const formattedPlanData = {
        ...planData,
        features: Array.isArray(planData.features) ? planData.features : []
      };

      const { data, error } = await supabase
        .from('subscription_plans')
        .insert([formattedPlanData])
        .select()
        .single();

      if (error) throw error;
      
      // Transform the returned data to ensure proper typing
      const formattedResult: SubscriptionPlan = {
        ...data,
        features: Array.isArray(data.features) 
          ? data.features 
          : typeof data.features === 'string'
            ? JSON.parse(data.features)
            : [],
        limits: data.limits && typeof data.limits === 'object'
          ? data.limits
          : typeof data.limits === 'string'
            ? JSON.parse(data.limits)
            : {}
      };
      
      setPlans(prev => [...prev, formattedResult]);
      
      toast({
        title: "Success",
        description: "Subscription plan created successfully",
      });
      
      return formattedResult;
    } catch (error) {
      console.error('Error creating subscription plan:', error);
      toast({
        title: "Error",
        description: "Failed to create subscription plan",
        variant: "destructive",
      });
      return null;
    }
  };

  const updatePlan = async (id: string, planData: Partial<SubscriptionPlan>) => {
    try {
      // Format date objects and ensure features is an array if provided
      const formattedData: Record<string, any> = {};
      
      Object.entries(planData).forEach(([key, value]) => {
        if (key === 'features' && value) {
          formattedData[key] = Array.isArray(value) ? value : [];
        } else if (value instanceof Date) {
          formattedData[key] = formatDateForSupabase(value);
        } else {
          formattedData[key] = value;
        }
      });
      
      const { data, error } = await supabase
        .from('subscription_plans')
        .update(formattedData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      // Transform the returned data to ensure proper typing
      const formattedResult: SubscriptionPlan = {
        ...data,
        features: Array.isArray(data.features) 
          ? data.features 
          : typeof data.features === 'string'
            ? JSON.parse(data.features)
            : [],
        limits: data.limits && typeof data.limits === 'object'
          ? data.limits
          : typeof data.limits === 'string'
            ? JSON.parse(data.limits)
            : {}
      };
      
      setPlans(prev => prev.map(plan => plan.id === id ? formattedResult : plan));
      
      toast({
        title: "Success",
        description: "Subscription plan updated successfully",
      });
      
      return formattedResult;
    } catch (error) {
      console.error('Error updating subscription plan:', error);
      toast({
        title: "Error",
        description: "Failed to update subscription plan",
        variant: "destructive",
      });
      return null;
    }
  };

  const deletePlan = async (id: string) => {
    try {
      // Soft delete by setting is_active to false
      const { error } = await supabase
        .from('subscription_plans')
        .update({ is_active: false })
        .eq('id', id);

      if (error) throw error;
      
      setPlans(prev => prev.filter(plan => plan.id !== id));
      
      toast({
        title: "Success",
        description: "Subscription plan deleted successfully",
      });
      
      return true;
    } catch (error) {
      console.error('Error deleting subscription plan:', error);
      toast({
        title: "Error",
        description: "Failed to delete subscription plan",
        variant: "destructive",
      });
      return false;
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  return {
    plans,
    isLoading,
    fetchPlans,
    createPlan,
    updatePlan,
    deletePlan
  };
}
