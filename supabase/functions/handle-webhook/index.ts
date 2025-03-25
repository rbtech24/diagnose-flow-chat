
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  // Only accept POST requests
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { 
      status: 405, 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
    });
  }

  try {
    // Create supabase admin client for database operations
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Parse the webhook request
    const webhookId = req.headers.get('x-webhook-id');
    const eventType = req.headers.get('x-event-type');
    const signature = req.headers.get('x-webhook-signature');

    if (!webhookId || !eventType) {
      return new Response(JSON.stringify({ error: 'Missing required headers' }), { 
        status: 400, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      });
    }

    // Get the payload from the request
    let payload;
    try {
      payload = await req.json();
    } catch (error) {
      return new Response(JSON.stringify({ error: 'Invalid JSON payload' }), { 
        status: 400, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      });
    }

    console.log(`Processing webhook: ${webhookId}, event: ${eventType}`);

    // Process the webhook event using our database function
    const { data, error } = await supabaseAdmin.rpc('process_webhook_event', {
      webhook_id: webhookId,
      event_type: eventType,
      payload: payload
    });

    if (error) {
      console.error('Error processing webhook:', error);
      return new Response(JSON.stringify({ error: 'Failed to process webhook' }), { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      });
    }

    // Log the webhook event
    await supabaseAdmin.from('webhook_events').insert({
      webhook_id: webhookId,
      event_type: eventType,
      payload: payload,
      status: data.error ? 'failed' : 'processed',
      error_message: data.error
    });

    // Return appropriate response
    if (data.error) {
      return new Response(JSON.stringify({ error: data.error }), { 
        status: 400, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      });
    }

    return new Response(JSON.stringify({ success: true, data }), { 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
    });
  } catch (error) {
    console.error('Unexpected error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), { 
      status: 500, 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
    });
  }
});
