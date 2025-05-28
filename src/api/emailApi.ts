
import { supabase } from "@/integrations/supabase/client";
import { APIErrorHandler } from "@/utils/apiErrorHandler";

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  htmlContent: string;
  textContent?: string;
  variables: string[];
  category: 'system' | 'marketing' | 'transactional';
  isActive: boolean;
  companyId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface EmailMessage {
  to: string | string[];
  cc?: string | string[];
  bcc?: string | string[];
  subject: string;
  htmlContent?: string;
  textContent?: string;
  templateId?: string;
  templateVariables?: Record<string, any>;
  attachments?: Array<{
    filename: string;
    content: string;
    type: string;
  }>;
}

export interface EmailDeliveryStatus {
  id: string;
  messageId: string;
  to: string;
  subject: string;
  status: 'queued' | 'sent' | 'delivered' | 'bounced' | 'failed';
  sentAt?: Date;
  deliveredAt?: Date;
  errorMessage?: string;
  opens: number;
  clicks: number;
  createdAt: Date;
}

// Send email
export const sendEmail = async (message: EmailMessage): Promise<{ messageId: string }> => {
  const response = await APIErrorHandler.handleAPICall(async () => {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) throw new Error("Authentication required");

    // Call edge function to send email
    const { data, error } = await supabase.functions.invoke('send-email', {
      body: {
        ...message,
        from: userData.user.email // Use authenticated user's email as sender
      }
    });

    if (error) throw error;

    // Log email in database
    const { error: logError } = await supabase
      .from("email_logs")
      .insert({
        message_id: data.messageId,
        to_addresses: Array.isArray(message.to) ? message.to : [message.to],
        cc_addresses: message.cc ? (Array.isArray(message.cc) ? message.cc : [message.cc]) : [],
        bcc_addresses: message.bcc ? (Array.isArray(message.bcc) ? message.bcc : [message.bcc]) : [],
        subject: message.subject,
        html_content: message.htmlContent,
        text_content: message.textContent,
        template_id: message.templateId,
        template_variables: message.templateVariables,
        sent_by: userData.user.id,
        company_id: userData.user.raw_user_meta_data?.company_id,
        status: 'queued'
      });

    if (logError) {
      console.warn("Failed to log email:", logError);
    }

    return { messageId: data.messageId };
  }, "sendEmail");

  if (!response.success) throw response.error;
  return response.data!;
};

// Send bulk emails
export const sendBulkEmails = async (messages: EmailMessage[]): Promise<{ messageIds: string[] }> => {
  const response = await APIErrorHandler.handleAPICall(async () => {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) throw new Error("Authentication required");

    const { data, error } = await supabase.functions.invoke('send-bulk-email', {
      body: {
        messages: messages.map(message => ({
          ...message,
          from: userData.user.email
        }))
      }
    });

    if (error) throw error;

    // Log emails in database
    const emailLogs = messages.map((message, index) => ({
      message_id: data.messageIds[index],
      to_addresses: Array.isArray(message.to) ? message.to : [message.to],
      cc_addresses: message.cc ? (Array.isArray(message.cc) ? message.cc : [message.cc]) : [],
      bcc_addresses: message.bcc ? (Array.isArray(message.bcc) ? message.bcc : [message.bcc]) : [],
      subject: message.subject,
      html_content: message.htmlContent,
      text_content: message.textContent,
      template_id: message.templateId,
      template_variables: message.templateVariables,
      sent_by: userData.user.id,
      company_id: userData.user.raw_user_meta_data?.company_id,
      status: 'queued'
    }));

    const { error: logError } = await supabase
      .from("email_logs")
      .insert(emailLogs);

    if (logError) {
      console.warn("Failed to log bulk emails:", logError);
    }

    return { messageIds: data.messageIds };
  }, "sendBulkEmails");

  if (!response.success) throw response.error;
  return response.data!;
};

// Fetch email templates
export const fetchEmailTemplates = async (): Promise<EmailTemplate[]> => {
  const response = await APIErrorHandler.handleAPICall(async () => {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) throw new Error("Authentication required");

    const { data, error } = await supabase
      .from("email_templates")
      .select("*")
      .or(`company_id.is.null,company_id.eq.${userData.user.raw_user_meta_data?.company_id}`)
      .eq("is_active", true)
      .order("name");

    if (error) throw error;

    return (data || []).map(template => ({
      id: template.id,
      name: template.name,
      subject: template.subject,
      htmlContent: template.html_content,
      textContent: template.text_content,
      variables: template.variables || [],
      category: template.category,
      isActive: template.is_active,
      companyId: template.company_id,
      createdAt: new Date(template.created_at),
      updatedAt: new Date(template.updated_at)
    }));
  }, "fetchEmailTemplates");

  if (!response.success) throw response.error;
  return response.data || [];
};

// Get email template by ID
export const getEmailTemplate = async (templateId: string): Promise<EmailTemplate> => {
  const response = await APIErrorHandler.handleAPICall(async () => {
    const { data, error } = await supabase
      .from("email_templates")
      .select("*")
      .eq("id", templateId)
      .single();

    if (error) throw error;
    if (!data) throw new Error("Template not found");

    return {
      id: data.id,
      name: data.name,
      subject: data.subject,
      htmlContent: data.html_content,
      textContent: data.text_content,
      variables: data.variables || [],
      category: data.category,
      isActive: data.is_active,
      companyId: data.company_id,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at)
    };
  }, "getEmailTemplate");

  if (!response.success) throw response.error;
  return response.data!;
};

// Fetch email delivery status
export const fetchEmailDeliveryStatus = async (
  messageId?: string,
  limit = 50
): Promise<EmailDeliveryStatus[]> => {
  const response = await APIErrorHandler.handleAPICall(async () => {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) throw new Error("Authentication required");

    let query = supabase
      .from("email_logs")
      .select("*")
      .eq("sent_by", userData.user.id)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (messageId) {
      query = query.eq("message_id", messageId);
    }

    const { data, error } = await query;
    if (error) throw error;

    return (data || []).map(log => ({
      id: log.id,
      messageId: log.message_id,
      to: log.to_addresses[0], // Primary recipient
      subject: log.subject,
      status: log.status,
      sentAt: log.sent_at ? new Date(log.sent_at) : undefined,
      deliveredAt: log.delivered_at ? new Date(log.delivered_at) : undefined,
      errorMessage: log.error_message,
      opens: log.opens || 0,
      clicks: log.clicks || 0,
      createdAt: new Date(log.created_at)
    }));
  }, "fetchEmailDeliveryStatus");

  if (!response.success) throw response.error;
  return response.data || [];
};

// Send template email
export const sendTemplateEmail = async (
  templateId: string,
  to: string | string[],
  variables: Record<string, any>,
  options?: {
    cc?: string | string[];
    bcc?: string | string[];
  }
): Promise<{ messageId: string }> => {
  const template = await getEmailTemplate(templateId);
  
  // Replace variables in subject and content
  let subject = template.subject;
  let htmlContent = template.htmlContent;
  let textContent = template.textContent;

  Object.entries(variables).forEach(([key, value]) => {
    const placeholder = `{{${key}}}`;
    subject = subject.replace(new RegExp(placeholder, 'g'), String(value));
    htmlContent = htmlContent.replace(new RegExp(placeholder, 'g'), String(value));
    if (textContent) {
      textContent = textContent.replace(new RegExp(placeholder, 'g'), String(value));
    }
  });

  return sendEmail({
    to,
    cc: options?.cc,
    bcc: options?.bcc,
    subject,
    htmlContent,
    textContent,
    templateId,
    templateVariables: variables
  });
};

// Create or update email template
export const saveEmailTemplate = async (template: {
  id?: string;
  name: string;
  subject: string;
  htmlContent: string;
  textContent?: string;
  variables: string[];
  category: EmailTemplate['category'];
}): Promise<EmailTemplate> => {
  const response = await APIErrorHandler.handleAPICall(async () => {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) throw new Error("Authentication required");

    const templateData = {
      name: template.name,
      subject: template.subject,
      html_content: template.htmlContent,
      text_content: template.textContent,
      variables: template.variables,
      category: template.category,
      company_id: userData.user.raw_user_meta_data?.company_id,
      is_active: true
    };

    let data, error;

    if (template.id) {
      // Update existing template
      ({ data, error } = await supabase
        .from("email_templates")
        .update(templateData)
        .eq("id", template.id)
        .select()
        .single());
    } else {
      // Create new template
      ({ data, error } = await supabase
        .from("email_templates")
        .insert(templateData)
        .select()
        .single());
    }

    if (error) throw error;

    return {
      id: data.id,
      name: data.name,
      subject: data.subject,
      htmlContent: data.html_content,
      textContent: data.text_content,
      variables: data.variables || [],
      category: data.category,
      isActive: data.is_active,
      companyId: data.company_id,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at)
    };
  }, "saveEmailTemplate");

  if (!response.success) throw response.error;
  return response.data!;
};
