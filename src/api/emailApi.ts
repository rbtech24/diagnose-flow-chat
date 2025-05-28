
import { supabase } from "@/integrations/supabase/client";
import { APIErrorHandler } from "@/utils/apiErrorHandler";

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  htmlContent: string;
  textContent: string;
  variables: string[];
  category: 'system' | 'marketing' | 'transactional';
  isActive: boolean;
  companyId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface EmailLog {
  id: string;
  messageId: string;
  toAddresses: string[];
  ccAddresses: string[];
  bccAddresses: string[];
  subject: string;
  htmlContent?: string;
  textContent?: string;
  status: 'queued' | 'sent' | 'delivered' | 'failed' | 'bounced';
  sentAt?: Date;
  deliveredAt?: Date;
  opens: number;
  clicks: number;
  errorMessage?: string;
  templateId?: string;
  templateVariables?: Record<string, any>;
  sentBy?: string;
  companyId?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Helper function to ensure valid status
const validateEmailStatus = (status: string): EmailLog['status'] => {
  const validStatuses: EmailLog['status'][] = ['queued', 'sent', 'delivered', 'failed', 'bounced'];
  return validStatuses.includes(status as EmailLog['status']) ? status as EmailLog['status'] : 'queued';
};

// Helper function to safely convert Json to Record<string, any>
const convertJsonToRecord = (jsonValue: any): Record<string, any> => {
  if (jsonValue === null || jsonValue === undefined) {
    return {};
  }
  if (typeof jsonValue === 'object' && !Array.isArray(jsonValue)) {
    return jsonValue as Record<string, any>;
  }
  return {};
};

// Send email using template
export const sendEmailFromTemplate = async (
  templateId: string,
  toAddresses: string[],
  variables: Record<string, any> = {},
  options?: {
    ccAddresses?: string[];
    bccAddresses?: string[];
    fromName?: string;
    fromEmail?: string;
  }
): Promise<EmailLog> => {
  const response = await APIErrorHandler.handleAPICall(async () => {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) throw new Error("Authentication required");

    // Get template
    const { data: template, error: templateError } = await supabase
      .from("email_templates")
      .select("*")
      .eq("id", templateId)
      .single();

    if (templateError) throw templateError;
    if (!template) throw new Error("Template not found");

    // Note: In a real implementation, this would integrate with SendGrid
    // For now, we'll just log the email
    const messageId = `msg_${Date.now()}_${Math.random().toString(36).substring(2)}`;
    
    const { data: emailLog, error: logError } = await supabase
      .from("email_logs")
      .insert({
        message_id: messageId,
        to_addresses: toAddresses,
        cc_addresses: options?.ccAddresses || [],
        bcc_addresses: options?.bccAddresses || [],
        subject: template.subject,
        html_content: template.html_content,
        text_content: template.text_content,
        template_id: templateId,
        template_variables: variables,
        sent_by: userData.user.id,
        company_id: userData.user.user_metadata?.company_id,
        status: 'sent',
        sent_at: new Date().toISOString()
      })
      .select()
      .single();

    if (logError) throw logError;

    return {
      id: emailLog.id,
      messageId: emailLog.message_id,
      toAddresses: emailLog.to_addresses,
      ccAddresses: emailLog.cc_addresses,
      bccAddresses: emailLog.bcc_addresses,
      subject: emailLog.subject,
      htmlContent: emailLog.html_content,
      textContent: emailLog.text_content,
      status: validateEmailStatus(emailLog.status),
      sentAt: emailLog.sent_at ? new Date(emailLog.sent_at) : undefined,
      deliveredAt: emailLog.delivered_at ? new Date(emailLog.delivered_at) : undefined,
      opens: emailLog.opens || 0,
      clicks: emailLog.clicks || 0,
      errorMessage: emailLog.error_message,
      templateId: emailLog.template_id,
      templateVariables: convertJsonToRecord(emailLog.template_variables),
      sentBy: emailLog.sent_by,
      companyId: emailLog.company_id,
      createdAt: new Date(emailLog.created_at),
      updatedAt: new Date(emailLog.updated_at)
    };
  }, "sendEmailFromTemplate");

  if (!response.success) throw response.error;
  return response.data!;
};

// Send simple email
export const sendEmail = async (
  toAddresses: string[],
  subject: string,
  htmlContent: string,
  options?: {
    textContent?: string;
    ccAddresses?: string[];
    bccAddresses?: string[];
    fromName?: string;
    fromEmail?: string;
  }
): Promise<EmailLog> => {
  const response = await APIErrorHandler.handleAPICall(async () => {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) throw new Error("Authentication required");

    // Note: In a real implementation, this would integrate with SendGrid
    // For now, we'll just log the email
    const messageId = `msg_${Date.now()}_${Math.random().toString(36).substring(2)}`;
    
    const { data: emailLog, error: logError } = await supabase
      .from("email_logs")
      .insert({
        message_id: messageId,
        to_addresses: toAddresses,
        cc_addresses: options?.ccAddresses || [],
        bcc_addresses: options?.bccAddresses || [],
        subject: subject,
        html_content: htmlContent,
        text_content: options?.textContent,
        sent_by: userData.user.id,
        company_id: userData.user.user_metadata?.company_id,
        status: 'sent',
        sent_at: new Date().toISOString()
      })
      .select()
      .single();

    if (logError) throw logError;

    return {
      id: emailLog.id,
      messageId: emailLog.message_id,
      toAddresses: emailLog.to_addresses,
      ccAddresses: emailLog.cc_addresses,
      bccAddresses: emailLog.bcc_addresses,
      subject: emailLog.subject,
      htmlContent: emailLog.html_content,
      textContent: emailLog.text_content,
      status: validateEmailStatus(emailLog.status),
      sentAt: emailLog.sent_at ? new Date(emailLog.sent_at) : undefined,
      deliveredAt: emailLog.delivered_at ? new Date(emailLog.delivered_at) : undefined,
      opens: emailLog.opens || 0,
      clicks: emailLog.clicks || 0,
      errorMessage: emailLog.error_message,
      templateId: emailLog.template_id,
      templateVariables: convertJsonToRecord(emailLog.template_variables),
      sentBy: emailLog.sent_by,
      companyId: emailLog.company_id,
      createdAt: new Date(emailLog.created_at),
      updatedAt: new Date(emailLog.updated_at)
    };
  }, "sendEmail");

  if (!response.success) throw response.error;
  return response.data!;
};

// Fetch email templates
export const fetchEmailTemplates = async (companyId?: string): Promise<EmailTemplate[]> => {
  const response = await APIErrorHandler.handleAPICall(async () => {
    let query = supabase
      .from("email_templates")
      .select("*")
      .eq("is_active", true)
      .order("created_at", { ascending: false });

    if (companyId) {
      query = query.eq("company_id", companyId);
    }

    const { data, error } = await query;
    if (error) throw error;

    return (data || []).map(template => ({
      id: template.id,
      name: template.name,
      subject: template.subject,
      htmlContent: template.html_content,
      textContent: template.text_content,
      variables: template.variables || [],
      category: template.category as EmailTemplate['category'],
      isActive: template.is_active,
      companyId: template.company_id,
      createdAt: new Date(template.created_at),
      updatedAt: new Date(template.updated_at)
    }));
  }, "fetchEmailTemplates");

  if (!response.success) throw response.error;
  return response.data || [];
};

// Fetch email logs
export const fetchEmailLogs = async (options?: {
  limit?: number;
  companyId?: string;
  status?: EmailLog['status'];
}): Promise<EmailLog[]> => {
  const response = await APIErrorHandler.handleAPICall(async () => {
    let query = supabase
      .from("email_logs")
      .select("*")
      .order("created_at", { ascending: false });

    if (options?.limit) {
      query = query.limit(options.limit);
    }

    if (options?.companyId) {
      query = query.eq("company_id", options.companyId);
    }

    if (options?.status) {
      query = query.eq("status", options.status);
    }

    const { data, error } = await query;
    if (error) throw error;

    return (data || []).map(log => ({
      id: log.id,
      messageId: log.message_id,
      toAddresses: log.to_addresses,
      ccAddresses: log.cc_addresses,
      bccAddresses: log.bcc_addresses,
      subject: log.subject,
      htmlContent: log.html_content,
      textContent: log.text_content,
      status: validateEmailStatus(log.status),
      sentAt: log.sent_at ? new Date(log.sent_at) : undefined,
      deliveredAt: log.delivered_at ? new Date(log.delivered_at) : undefined,
      opens: log.opens || 0,
      clicks: log.clicks || 0,
      errorMessage: log.error_message,
      templateId: log.template_id,
      templateVariables: convertJsonToRecord(log.template_variables),
      sentBy: log.sent_by,
      companyId: log.company_id,
      createdAt: new Date(log.created_at),
      updatedAt: new Date(log.updated_at)
    }));
  }, "fetchEmailLogs");

  if (!response.success) throw response.error;
  return response.data || [];
};
