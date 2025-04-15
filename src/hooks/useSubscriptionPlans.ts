
import { useState } from "react";

export interface SubscriptionPlan {
  id: string;
  name: string;
  price_monthly: number;
  price_yearly: number;
  features: string[];
  is_active: boolean;
  description?: string;
  recommended?: boolean;
  trial_period: number;
  usage_limits?: {
    diagnostics_per_day: number;
    technicians: number;
    storage_gb: number;
  };
}

const initialPlans: SubscriptionPlan[] = [
  {
    id: "1",
    name: "Basic",
    price_monthly: 49,
    price_yearly: 470,
    features: ["Up to 5 technicians", "Basic diagnostics", "Email support"],
    is_active: true,
    description: "Perfect for small repair businesses",
    recommended: false,
    trial_period: 30, // Changed from 14 to 30
    usage_limits: {
      diagnostics_per_day: 10,
      technicians: 5,
      storage_gb: 5
    }
  },
  {
    id: "2",
    name: "Professional",
    price_monthly: 99,
    price_yearly: 950,
    features: ["Up to 15 technicians", "Advanced diagnostics", "Priority support", "Custom workflows"],
    is_active: true,
    description: "Ideal for growing businesses",
    recommended: true,
    trial_period: 30, // Changed from 14 to 30
    usage_limits: {
      diagnostics_per_day: 25,
      technicians: 15,
      storage_gb: 20
    }
  },
  {
    id: "3",
    name: "Enterprise",
    price_monthly: 199,
    price_yearly: 1900,
    features: ["Unlimited technicians", "All features", "24/7 support", "Dedicated account manager", "Custom integrations"],
    is_active: false,
    description: "For large organizations with complex needs",
    recommended: false,
    trial_period: 30, // Changed from 14 to 30
    usage_limits: {
      diagnostics_per_day: 100,
      technicians: 50,
      storage_gb: 100
    }
  }
];

export function useSubscriptionPlans() {
  const [plans, setPlans] = useState<SubscriptionPlan[]>(initialPlans);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchPlans = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // In a real app, we would call an API to fetch the plans
      // For now, we'll use the initial plans
      setPlans(initialPlans);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("An unknown error occurred"));
    } finally {
      setIsLoading(false);
    }
  };

  const addPlan = async (plan: Omit<SubscriptionPlan, "id">) => {
    setIsLoading(true);
    setError(null);
    try {
      // In a real app, we would call an API to add the plan
      const newPlan = {
        ...plan,
        id: `plan-${Date.now()}`, // Generate a unique ID
      };
      setPlans([...plans, newPlan]);
      return newPlan;
    } catch (err) {
      setError(err instanceof Error ? err : new Error("An unknown error occurred"));
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const updatePlan = async (id: string, plan: Partial<SubscriptionPlan>) => {
    setIsLoading(true);
    setError(null);
    try {
      // In a real app, we would call an API to update the plan
      const updatedPlans = plans.map(p => 
        p.id === id ? { ...p, ...plan } : p
      );
      setPlans(updatedPlans);
      return updatedPlans.find(p => p.id === id) || null;
    } catch (err) {
      setError(err instanceof Error ? err : new Error("An unknown error occurred"));
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const deletePlan = async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      // In a real app, we would call an API to delete the plan
      setPlans(plans.filter(p => p.id !== id));
      return true;
    } catch (err) {
      setError(err instanceof Error ? err : new Error("An unknown error occurred"));
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    plans,
    isLoading,
    error,
    fetchPlans,
    addPlan,
    updatePlan,
    deletePlan,
  };
}
