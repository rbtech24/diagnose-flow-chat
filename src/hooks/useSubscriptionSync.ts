
import { useEffect } from 'react';
import { useSubscriptionStore } from '@/store/subscriptionStore';
import { supabase } from '@/integrations/supabase/client';

export const useSubscriptionSync = () => {
  const { fetchPlans } = useSubscriptionStore();

  useEffect(() => {
    // Set up real-time subscription for plan changes
    const channel = supabase
      .channel('subscription-plans-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'subscription_plans'
        },
        (payload) => {
          console.log('Real-time subscription plan change detected:', payload);
          // Refresh plans when any change occurs
          fetchPlans();
        }
      )
      .subscribe();

    // Initial fetch
    fetchPlans();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchPlans]);

  return {
    syncPlans: fetchPlans
  };
};
