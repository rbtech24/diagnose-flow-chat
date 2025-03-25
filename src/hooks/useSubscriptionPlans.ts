
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
      
      // Transform the data to ensure features is always a string array
      const formattedData = data?.map(plan => ({
        ...plan,
        features: Array.isArray(plan.features) 
          ? plan.features 
          : typeof plan.features === 'string' 
            ? [plan.features]
            : typeof plan.features === 'object' && plan.features !== null
              ? Array.isArray(JSON.parse(JSON.stringify(plan.features)))
                ? JSON.parse(JSON.stringify(plan.features))
                : []
              : []
      })) || [];
      
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
      // Ensure features is an array
      const formattedPlanData = {
        ...planData,
        features: Array.isArray(planData.features) ? planData.features : [planData.features].filter(Boolean)
      };

      const { data, error } = await supabase
        .from('subscription_plans')
        .insert([formattedPlanData])
        .select()
        .single();

      if (error) throw error;
      
      // Ensure the returned data has features as string array
      const formattedResult = {
        ...data,
        features: Array.isArray(data.features) 
          ? data.features 
          : typeof data.features === 'string' 
            ? [data.features] 
            : Array.isArray(JSON.parse(JSON.stringify(data.features)))
              ? JSON.parse(JSON.stringify(data.features))
              : []
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
      const formattedData = Object.entries(planData).reduce((acc, [key, value]) => {
        if (key === 'features' && value) {
          acc[key] = Array.isArray(value) ? value : [value].filter(Boolean);
        } else if (value instanceof Date) {
          acc[key] = formatDateForSupabase(value);
        } else {
          acc[key] = value;
        }
        return acc;
      }, {} as Record<string, any>);
      
      const { data, error } = await supabase
        .from('subscription_plans')
        .update(formattedData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      // Ensure the returned data has features as string array
      const formattedResult = {
        ...data,
        features: Array.isArray(data.features) 
          ? data.features 
          : typeof data.features === 'string' 
            ? [data.features] 
            : Array.isArray(JSON.parse(JSON.stringify(data.features)))
              ? JSON.parse(JSON.stringify(data.features))
              : []
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
