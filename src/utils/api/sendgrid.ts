
import { useAPIConfigStore } from "@/store/apiConfigStore";

export const getSendgridConfig = () => {
  const { configs } = useAPIConfigStore.getState();
  return configs.sendgrid;
};

export async function sendEmail(
  to: string,
  subject: string,
  htmlContent: string,
  fromName?: string,
  fromEmail?: string
) {
  const config = getSendgridConfig();
  
  if (!config.enabled || !config.apiKey) {
    throw new Error('SendGrid is not configured');
  }
  
  try {
    // In a real implementation, this would call a Supabase Edge Function
    const response = await fetch('/api/sendgrid/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to,
        subject,
        htmlContent,
        fromName,
        fromEmail
      }),
    });
    
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error sending email with SendGrid:', error);
    throw new Error('Failed to send email');
  }
}

export async function sendTemplatedEmail(
  to: string,
  templateId: string, 
  dynamicData: Record<string, any>,
  fromName?: string,
  fromEmail?: string
) {
  const config = getSendgridConfig();
  
  if (!config.enabled || !config.apiKey) {
    throw new Error('SendGrid is not configured');
  }
  
  try {
    // In a real implementation, this would call a Supabase Edge Function
    const response = await fetch('/api/sendgrid/send-template', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to,
        templateId,
        dynamicData,
        fromName,
        fromEmail
      }),
    });
    
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error sending templated email with SendGrid:', error);
    throw new Error('Failed to send templated email');
  }
}
