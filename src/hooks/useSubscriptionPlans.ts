
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

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
      
      setPlans(data || []);
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
      const { data, error } = await supabase
        .from('subscription_plans')
        .insert([planData])
        .select()
        .single();

      if (error) throw error;
      
      setPlans(prev => [...prev, data]);
      
      toast({
        title: "Success",
        description: "Subscription plan created successfully",
      });
      
      return data;
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
      // Convert Date objects to strings if necessary
      const formattedData = Object.entries(planData).reduce((acc, [key, value]) => {
        acc[key] = value instanceof Date ? value.toISOString() : value;
        return acc;
      }, {} as Record<string, any>);
      
      const { data, error } = await supabase
        .from('subscription_plans')
        .update(formattedData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      setPlans(prev => prev.map(plan => plan.id === id ? data : plan));
      
      toast({
        title: "Success",
        description: "Subscription plan updated successfully",
      });
      
      return data;
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
