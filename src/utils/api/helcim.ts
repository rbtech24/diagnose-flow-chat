
import { useAPIConfigStore } from "@/store/apiConfigStore";

export const getHelcimConfig = () => {
  const { configs } = useAPIConfigStore.getState();
  return configs.helcim;
};

export async function processHelcimPayment(
  amount: number, 
  cardNumber: string, 
  cardExpiry: string, 
  cardCvv: string
) {
  const config = getHelcimConfig();
  
  if (!config.enabled || !config.apiKey) {
    throw new Error('Helcim is not configured');
  }
  
  try {
    // In a real implementation, this would call a Supabase Edge Function
    const response = await fetch('/api/helcim/process-payment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount,
        card: {
          number: cardNumber,
          expiry: cardExpiry,
          cvv: cardCvv
        }
      }),
    });
    
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error processing Helcim payment:', error);
    throw new Error('Failed to process payment');
  }
}
