
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Create a Supabase client with the Auth context of the logged in user
    const supabaseClient = createClient(
      // Supabase API URL - env var exported by default
      Deno.env.get('SUPABASE_URL') ?? '',
      // Supabase API ANON KEY - env var exported by default
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      // Create client with Auth context of the user that called the function
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    // Parse the request body
    const { userId } = await req.json()

    if (!userId) {
      return new Response(
        JSON.stringify({ error: 'Missing user ID' }), 
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    // Call the database function
    const { data: activities, error } = await supabaseClient.rpc('get_user_activity', {
      p_user_id: userId
    })

    if (error) {
      console.error('Error fetching user activities:', error)
      return new Response(
        JSON.stringify({ error: error.message }), 
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      )
    }

    // If no activities found, create a default message
    const formattedActivities = activities.length > 0 ? activities : [
      {
        id: 'default',
        activity_type: 'info',
        description: 'No activity records found',
        created_at: new Date().toISOString()
      }
    ]

    // Map the activities to a more friendly format for the frontend
    const formattedResult = formattedActivities.map(activity => ({
      id: activity.id,
      title: activity.activity_type === 'info' ? activity.description : 
             `${activity.activity_type.charAt(0).toUpperCase() + activity.activity_type.slice(1)} - ${activity.description || ''}`,
      timestamp: activity.created_at,
      metadata: activity.metadata || {}
    }))

    // Return the activities
    return new Response(
      JSON.stringify(formattedResult),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    )
  } catch (error) {
    console.error('Unknown error:', error)
    return new Response(
      JSON.stringify({ error: 'Unknown error occurred' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})
