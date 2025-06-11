
import { supabase } from "@/integrations/supabase/client";
import { useAPIConfigStore } from "@/store/apiConfigStore";

export const getHelcimConfig = () => {
  const { configs } = useAPIConfigStore.getState();
  return configs.helcim;
};

export async function processHelcimPayment(
  amount: number, 
  cardNumber: string, 
  cardExpiry: string, 
  cardCvv: string,
  planId: string,
  billingCycle: string,
  companyId?: string
) {
  const config = getHelcimConfig();
  
  if (!config.enabled || !config.apiKey) {
    throw new Error('Helcim is not configured');
  }
  
  try {
    const { data, error } = await supabase.functions.invoke('helcim-payment', {
      body: {
        amount: Math.round(amount * 100), // Convert to cents
        cardNumber,
        cardExpiry,
        cardCvv,
        planId,
        billingCycle,
        companyId
      }
    });

    if (error) {
      console.error('Helcim payment error:', error);
      throw new Error(error.message || 'Failed to process payment');
    }

    if (!data.success) {
      throw new Error(data.error || 'Payment processing failed');
    }

    return {
      success: true,
      transactionId: data.transactionId,
      license: data.license
    };
  } catch (error) {
    console.error('Error processing Helcim payment:', error);
    throw new Error('Failed to process payment with Helcim');
  }
}

export async function validateHelcimCredentials(apiKey: string, apiToken: string) {
  try {
    // Test API credentials by making a small validation request
    const response = await fetch("https://api.helcim.com/v2/helcim-pay/initialize", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-token": apiToken,
        "Accept": "application/json"
      },
      body: JSON.stringify({
        paymentType: "purchase",
        amount: 100, // $1.00 test amount
        currency: "USD"
      })
    });

    return response.ok;
  } catch (error) {
    console.error('Error validating Helcim credentials:', error);
    return false;
  }
}
