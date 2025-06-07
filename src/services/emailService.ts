
import { supabase } from "@/integrations/supabase/client";

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  html_content: string;
  text_content?: string;
  category: string;
  variables: string[];
  is_active: boolean;
}

export interface EmailLog {
  id: string;
  to_addresses: string[];
  cc_addresses: string[];
  bcc_addresses: string[];
  subject: string;
  html_content?: string;
  text_content?: string;
  status: 'queued' | 'sent' | 'delivered' | 'failed' | 'bounced';
  template_id?: string;
  template_variables?: Record<string, any>;
  sent_at?: string;
  delivered_at?: string;
  error_message?: string;
  opens: number;
  clicks: number;
  created_at: string;
  updated_at: string;
  sent_by?: string;
  company_id?: string;
  message_id: string;
}

export interface SendEmailParams {
  to: string[];
  subject: string;
  htmlContent?: string;
  textContent?: string;
  templateId?: string;
  templateVariables?: Record<string, any>;
  cc?: string[];
  bcc?: string[];
}

class EmailService {
  /**
   * Send an email using a template or direct content
   */
  async sendEmail(params: SendEmailParams): Promise<EmailLog> {
    console.log('Sending email:', params);
    
    try {
      // Call the edge function to send the email
      const { data, error } = await supabase.functions.invoke('send-email', {
        body: {
          to: params.to,
          subject: params.subject,
          html_content: params.htmlContent,
          text_content: params.textContent,
          template_id: params.templateId,
          template_variables: params.templateVariables,
          cc: params.cc || [],
          bcc: params.bcc || []
        }
      });

      if (error) {
        throw new Error(`Failed to send email: ${error.message}`);
      }

      return data as EmailLog;
    } catch (error) {
      console.error('Error sending email:', error);
      throw error;
    }
  }

  /**
   * Send email using a template
   */
  async sendTemplateEmail(
    templateId: string,
    to: string[],
    variables: Record<string, any> = {},
    options?: { cc?: string[]; bcc?: string[] }
  ): Promise<EmailLog> {
    // First fetch the template
    const template = await this.getTemplate(templateId);
    if (!template) {
      throw new Error(`Template with ID ${templateId} not found`);
    }

    // Replace variables in template
    const subject = this.replaceVariables(template.subject, variables);
    const htmlContent = this.replaceVariables(template.html_content, variables);
    const textContent = template.text_content 
      ? this.replaceVariables(template.text_content, variables)
      : undefined;

    return this.sendEmail({
      to,
      subject,
      htmlContent,
      textContent,
      templateId,
      templateVariables: variables,
      cc: options?.cc,
      bcc: options?.bcc
    });
  }

  /**
   * Get email template by ID
   */
  async getTemplate(templateId: string): Promise<EmailTemplate | null> {
    const { data, error } = await supabase
      .from('email_templates')
      .select('*')
      .eq('id', templateId)
      .eq('is_active', true)
      .single();

    if (error) {
      console.error('Error fetching email template:', error);
      return null;
    }

    return data as EmailTemplate;
  }

  /**
   * Get all email templates for a company
   */
  async getTemplates(companyId?: string): Promise<EmailTemplate[]> {
    let query = supabase
      .from('email_templates')
      .select('*')
      .eq('is_active', true)
      .order('name');

    if (companyId) {
      query = query.eq('company_id', companyId);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching email templates:', error);
      return [];
    }

    return (data || []) as EmailTemplate[];
  }

  /**
   * Get email logs with pagination
   */
  async getEmailLogs(
    companyId?: string,
    options?: {
      limit?: number;
      offset?: number;
      status?: string;
      startDate?: string;
      endDate?: string;
    }
  ): Promise<{ logs: EmailLog[]; total: number }> {
    let query = supabase
      .from('email_logs')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false });

    if (companyId) {
      query = query.eq('company_id', companyId);
    }

    if (options?.status) {
      query = query.eq('status', options.status);
    }

    if (options?.startDate) {
      query = query.gte('created_at', options.startDate);
    }

    if (options?.endDate) {
      query = query.lte('created_at', options.endDate);
    }

    if (options?.limit) {
      const offset = options.offset || 0;
      query = query.range(offset, offset + options.limit - 1);
    }

    const { data, error, count } = await query;

    if (error) {
      console.error('Error fetching email logs:', error);
      return { logs: [], total: 0 };
    }

    return {
      logs: (data || []) as EmailLog[],
      total: count || 0
    };
  }

  /**
   * Replace variables in template content
   */
  private replaceVariables(content: string, variables: Record<string, any>): string {
    let result = content;
    
    Object.entries(variables).forEach(([key, value]) => {
      const regex = new RegExp(`{{\\s*${key}\\s*}}`, 'g');
      result = result.replace(regex, String(value || ''));
    });

    return result;
  }

  /**
   * Send notification email (common use case)
   */
  async sendNotificationEmail(
    to: string,
    subject: string,
    message: string,
    options?: {
      type?: 'info' | 'warning' | 'error' | 'success';
      actionUrl?: string;
      actionText?: string;
    }
  ): Promise<EmailLog> {
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <h2 style="color: #333; margin: 0 0 10px 0;">${subject}</h2>
          <p style="color: #666; margin: 0; line-height: 1.5;">${message}</p>
        </div>
        
        ${options?.actionUrl ? `
          <div style="text-align: center; margin: 20px 0;">
            <a href="${options.actionUrl}" 
               style="background-color: #007bff; color: white; padding: 12px 24px; 
                      text-decoration: none; border-radius: 4px; display: inline-block;">
              ${options.actionText || 'View Details'}
            </a>
          </div>
        ` : ''}
        
        <div style="border-top: 1px solid #eee; padding-top: 20px; margin-top: 20px; 
                    color: #999; font-size: 12px; text-align: center;">
          <p>This is an automated message. Please do not reply to this email.</p>
        </div>
      </div>
    `;

    const textContent = `
${subject}

${message}

${options?.actionUrl ? `\n${options.actionText || 'View Details'}: ${options.actionUrl}\n` : ''}

---
This is an automated message. Please do not reply to this email.
    `;

    return this.sendEmail({
      to: [to],
      subject,
      htmlContent,
      textContent
    });
  }
}

export const emailService = new EmailService();
