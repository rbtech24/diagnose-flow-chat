
import { useAPIConfigStore } from "@/store/apiConfigStore";

export const getTwilioConfig = () => {
  const { configs } = useAPIConfigStore.getState();
  return configs.twilio;
};

export async function sendSMS(
  to: string,
  message: string
) {
  const config = getTwilioConfig();
  
  if (!config.enabled || !config.apiKey || !config.additionalSettings?.accountSid) {
    throw new Error('Twilio is not configured properly');
  }
  
  try {
    // In a real implementation, this would call a Supabase Edge Function
    const response = await fetch('/api/twilio/send-sms', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to,
        message
      }),
    });
    
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error sending SMS with Twilio:', error);
    throw new Error('Failed to send SMS');
  }
}

export async function makeVoiceCall(
  to: string,
  twimlUrl: string
) {
  const config = getTwilioConfig();
  
  if (!config.enabled || !config.apiKey || !config.additionalSettings?.accountSid) {
    throw new Error('Twilio is not configured properly');
  }
  
  try {
    // In a real implementation, this would call a Supabase Edge Function
    const response = await fetch('/api/twilio/make-call', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to,
        twimlUrl
      }),
    });
    
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error making voice call with Twilio:', error);
    throw new Error('Failed to make voice call');
  }
}
