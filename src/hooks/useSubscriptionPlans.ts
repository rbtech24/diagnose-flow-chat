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

  const ensureStringArray = (value: any): string[] => {
    if (Array.isArray(value)) {
      return value.map(String);
    }
    if (typeof value === 'string') {
      try {
        const parsed = JSON.parse(value);
        return Array.isArray(parsed) ? parsed.map(String) : [value];
      } catch {
        return [value];
      }
    }
    return [];
  };

  const fetchPlans = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('subscription_plans')
        .select('*')
        .eq('is_active', true)
        .order('price_monthly', { ascending: true });

      if (error) throw error;

      const formattedData = (data || []).map(plan => ({
        ...plan,
        features: ensureStringArray(plan.features),
        limits: typeof plan.limits === 'string' ? JSON.parse(plan.limits) : plan.limits || {}
      }));
      
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
