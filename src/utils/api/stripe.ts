
import { useAPIConfigStore } from "@/store/apiConfigStore";

export const getStripeConfig = () => {
  const { configs } = useAPIConfigStore.getState();
  return configs.stripe;
};

export async function createStripeCheckoutSession(priceId: string, customerId?: string) {
  const config = getStripeConfig();
  
  if (!config.enabled || !config.apiKey) {
    throw new Error('Stripe is not configured');
  }
  
  try {
    // In a real implementation, this would call a Supabase Edge Function
    // that would use the Stripe SDK server-side
    const response = await fetch('/api/stripe/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        priceId,
        customerId
      }),
    });
    
    const session = await response.json();
    return session;
  } catch (error) {
    console.error('Error creating Stripe session:', error);
    throw new Error('Failed to create checkout session');
  }
}

export async function createStripeCustomer(email: string, name: string) {
  const config = getStripeConfig();
  
  if (!config.enabled || !config.apiKey) {
    throw new Error('Stripe is not configured');
  }

  try {
    // In a real implementation, this would call a Supabase Edge Function
    const response = await fetch('/api/stripe/create-customer', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        name
      }),
    });
    
    const customer = await response.json();
    return customer;
  } catch (error) {
    console.error('Error creating Stripe customer:', error);
    throw new Error('Failed to create customer');
  }
}
