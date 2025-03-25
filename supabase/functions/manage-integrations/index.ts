
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

  try {
    // Create a Supabase client with the Auth context of the logged in user
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    // Get the user from the request
    const {
      data: { user },
    } = await supabaseClient.auth.getUser();

    if (!user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get the current user's company_id
    const { data: technicianData, error: technicianError } = await supabaseClient
      .from('technicians')
      .select('company_id, role')
      .eq('id', user.id)
      .single();

    if (technicianError || !technicianData) {
      console.error('Error fetching technician data:', technicianError);
      return new Response(
        JSON.stringify({ error: 'Failed to fetch technician data' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const companyId = technicianData.company_id;
    const isAdmin = ['admin', 'company_admin'].includes(technicianData.role);

    if (!isAdmin) {
      return new Response(
        JSON.stringify({ error: 'Permission denied' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Parse URL to extract endpoint path
    const url = new URL(req.url);
    const pathParts = url.pathname.split('/');
    const endpoint = pathParts[pathParts.length - 1]; // Get the last part of the URL

    // Handle different methods
    switch (req.method) {
      case 'GET': {
        if (endpoint === 'available') {
          // Get available integrations (predefined list)
          return new Response(
            JSON.stringify({
              data: [
                { 
                  id: "stripe", 
                  name: "Stripe", 
                  category: "Payment", 
                  status: "Not Connected", 
                  description: "Process payments and subscriptions" 
                },
                { 
                  id: "twilio", 
                  name: "Twilio", 
                  category: "Communication", 
                  status: "Not Connected", 
                  description: "Send SMS and make voice calls" 
                },
                { 
                  id: "sendgrid", 
                  name: "SendGrid", 
                  category: "Email", 
                  status: "Not Connected", 
                  description: "Send transactional and marketing emails" 
                },
                { 
                  id: "google", 
                  name: "Google Maps", 
                  category: "Maps", 
                  status: "Not Connected", 
                  description: "Integrate maps and location services" 
                },
                { 
                  id: "openai", 
                  name: "OpenAI", 
                  category: "AI", 
                  status: "Not Connected", 
                  description: "Add AI and ML capabilities" 
                },
                { 
                  id: "s3", 
                  name: "Amazon S3", 
                  category: "Storage", 
                  status: "Not Connected", 
                  description: "Cloud storage for files and media" 
                },
              ]
            }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        } else if (endpoint === 'connected') {
          // Get connected integrations from database
          const { data, error } = await supabaseClient
            .from('api_integrations')
            .select('*')
            .eq('company_id', companyId);

          if (error) {
            console.error('Error fetching integrations:', error);
            return new Response(
              JSON.stringify({ error: 'Failed to fetch integrations' }),
              { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
          }

          return new Response(
            JSON.stringify({ data }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        } else if (endpoint === 'webhooks') {
          // Get webhook endpoints from database
          const { data, error } = await supabaseClient
            .from('webhook_endpoints')
            .select('*')
            .eq('company_id', companyId);

          if (error) {
            console.error('Error fetching webhooks:', error);
            return new Response(
              JSON.stringify({ error: 'Failed to fetch webhooks' }),
              { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
          }

          return new Response(
            JSON.stringify({ data }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        return new Response(
          JSON.stringify({ error: 'Invalid endpoint' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      case 'POST': {
        // Parse the request body
        const requestData = await req.json();
        
        if (endpoint === 'connect') {
          // Add a new integration
          const { provider, name, description, category, config = {}, credentials = {} } = requestData;
          
          if (!provider || !name || !category) {
            return new Response(
              JSON.stringify({ error: 'Missing required fields' }),
              { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
          }

          const { data, error } = await supabaseClient
            .from('api_integrations')
            .insert({
              provider,
              name,
              description,
              category,
              config,
              credentials,
              status: 'connected',
              company_id: companyId,
              created_by: user.id
            })
            .select()
            .single();

          if (error) {
            console.error('Error connecting integration:', error);
            return new Response(
              JSON.stringify({ error: 'Failed to connect integration' }),
              { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
          }

          return new Response(
            JSON.stringify({ data, success: true }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        } else if (endpoint === 'disconnect') {
          // Disconnect an integration
          const { integrationId } = requestData;
          
          if (!integrationId) {
            return new Response(
              JSON.stringify({ error: 'Missing integration ID' }),
              { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
          }

          const { data, error } = await supabaseClient
            .from('api_integrations')
            .delete()
            .eq('id', integrationId)
            .eq('company_id', companyId)
            .select()
            .single();

          if (error) {
            console.error('Error disconnecting integration:', error);
            return new Response(
              JSON.stringify({ error: 'Failed to disconnect integration' }),
              { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
          }

          return new Response(
            JSON.stringify({ data, success: true }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        } else if (endpoint === 'webhook') {
          // Create a new webhook endpoint
          const { name, description, url, events, integrationId } = requestData;
          
          if (!name || !url || !events || !integrationId) {
            return new Response(
              JSON.stringify({ error: 'Missing required fields' }),
              { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
          }

          const { data, error } = await supabaseClient
            .from('webhook_endpoints')
            .insert({
              name,
              description,
              url,
              events,
              integration_id: integrationId,
              company_id: companyId,
              created_by: user.id,
              status: 'active',
              secret_key: crypto.randomUUID()
            })
            .select()
            .single();

          if (error) {
            console.error('Error creating webhook:', error);
            return new Response(
              JSON.stringify({ error: 'Failed to create webhook' }),
              { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
          }

          return new Response(
            JSON.stringify({ data, success: true }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        return new Response(
          JSON.stringify({ error: 'Invalid endpoint' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      default:
        return new Response(
          JSON.stringify({ error: 'Method not allowed' }),
          { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
    }
  } catch (error) {
    console.error('Error processing request:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
