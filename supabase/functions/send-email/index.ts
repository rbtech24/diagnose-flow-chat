
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface SendEmailRequest {
  to: string[];
  subject: string;
  html_content?: string;
  text_content?: string;
  template_id?: string;
  template_variables?: Record<string, any>;
  cc?: string[];
  bcc?: string[];
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    // Get the current user
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser()
    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    const emailRequest: SendEmailRequest = await req.json()
    
    // Validate required fields
    if (!emailRequest.to || emailRequest.to.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Recipients (to) are required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    if (!emailRequest.subject) {
      return new Response(
        JSON.stringify({ error: 'Subject is required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Generate a unique message ID
    const messageId = `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    // Get user's company_id
    const { data: profile } = await supabaseClient
      .from('profiles')
      .select('company_id')
      .eq('id', user.id)
      .single()

    let finalHtmlContent = emailRequest.html_content
    let finalTextContent = emailRequest.text_content

    // If template_id is provided, fetch and process the template
    if (emailRequest.template_id) {
      const { data: template, error: templateError } = await supabaseClient
        .from('email_templates')
        .select('*')
        .eq('id', emailRequest.template_id)
        .eq('is_active', true)
        .single()

      if (templateError || !template) {
        return new Response(
          JSON.stringify({ error: 'Template not found or inactive' }),
          { 
            status: 404, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
      }

      // Replace variables in template content
      const variables = emailRequest.template_variables || {}
      finalHtmlContent = replaceVariables(template.html_content, variables)
      finalTextContent = template.text_content 
        ? replaceVariables(template.text_content, variables)
        : undefined
    }

    // For now, we'll log the email instead of actually sending it
    // In a real implementation, you would integrate with SendGrid, AWS SES, etc.
    console.log('Email would be sent:', {
      to: emailRequest.to,
      subject: emailRequest.subject,
      html_content: finalHtmlContent,
      text_content: finalTextContent
    })

    // Create email log entry
    const { data: emailLog, error: logError } = await supabaseClient
      .from('email_logs')
      .insert({
        message_id: messageId,
        to_addresses: emailRequest.to,
        cc_addresses: emailRequest.cc || [],
        bcc_addresses: emailRequest.bcc || [],
        subject: emailRequest.subject,
        html_content: finalHtmlContent,
        text_content: finalTextContent,
        template_id: emailRequest.template_id,
        template_variables: emailRequest.template_variables,
        status: 'sent',
        sent_at: new Date().toISOString(),
        sent_by: user.id,
        company_id: profile?.company_id,
        opens: 0,
        clicks: 0
      })
      .select()
      .single()

    if (logError) {
      console.error('Error creating email log:', logError)
      return new Response(
        JSON.stringify({ error: 'Failed to log email' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    return new Response(
      JSON.stringify(emailLog),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Error in send-email function:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})

function replaceVariables(content: string, variables: Record<string, any>): string {
  let result = content
  
  Object.entries(variables).forEach(([key, value]) => {
    const regex = new RegExp(`{{\\s*${key}\\s*}}`, 'g')
    result = result.replace(regex, String(value || ''))
  })

  return result
}
