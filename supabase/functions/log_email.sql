
-- Function to log email data
CREATE OR REPLACE FUNCTION public.log_email(
  p_message_id TEXT,
  p_to_addresses TEXT[],
  p_cc_addresses TEXT[] DEFAULT '{}',
  p_bcc_addresses TEXT[] DEFAULT '{}',
  p_subject TEXT,
  p_html_content TEXT DEFAULT NULL,
  p_text_content TEXT DEFAULT NULL,
  p_template_id UUID DEFAULT NULL,
  p_template_variables JSONB DEFAULT '{}',
  p_sent_by UUID DEFAULT NULL,
  p_company_id UUID DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  log_id UUID;
BEGIN
  INSERT INTO public.email_logs (
    message_id,
    to_addresses,
    cc_addresses,
    bcc_addresses,
    subject,
    html_content,
    text_content,
    template_id,
    template_variables,
    sent_by,
    company_id,
    status
  ) VALUES (
    p_message_id,
    p_to_addresses,
    p_cc_addresses,
    p_bcc_addresses,
    p_subject,
    p_html_content,
    p_text_content,
    p_template_id,
    p_template_variables,
    COALESCE(p_sent_by, auth.uid()),
    p_company_id,
    'queued'
  ) RETURNING id INTO log_id;
  
  RETURN log_id;
END;
$$;
