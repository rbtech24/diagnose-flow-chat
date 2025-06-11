
import { supabase } from "@/integrations/supabase/client";

export class StripeService {
  static async createCheckoutSession(planId: string, billingCycle: 'monthly' | 'yearly') {
    const { data, error } = await supabase.functions.invoke('create-subscription', {
      body: { planId, billingCycle }
    });

    if (error) throw error;
    return data;
  }

  static async createCustomerPortalSession() {
    const { data, error } = await supabase.functions.invoke('customer-portal');

    if (error) throw error;
    return data;
  }

  static async cancelSubscription(licenseId: string) {
    // This would typically call a backend function to cancel via Stripe API
    const { error } = await supabase
      .from('licenses')
      .update({ 
        status: 'canceled',
        updated_at: new Date().toISOString()
      })
      .eq('id', licenseId);

    if (error) throw error;
  }
}
