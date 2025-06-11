
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const supabaseClient = createClient(
  Deno.env.get("SUPABASE_URL") ?? "",
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
  { auth: { persistSession: false } }
);

serve(async (req) => {
  try {
    console.log('Running billing scheduler...');

    // Process expired trials
    const now = new Date().toISOString();
    await supabaseClient
      .from('licenses')
      .update({ 
        status: 'expired',
        updated_at: now
      })
      .eq('status', 'trial')
      .lt('trial_ends_at', now);

    // Send renewal notifications (3 days before)
    const threeDaysFromNow = new Date();
    threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3);

    const { data: upcomingRenewals } = await supabaseClient
      .from('licenses')
      .select('*')
      .eq('status', 'active')
      .lte('next_payment', threeDaysFromNow.toISOString())
      .gte('next_payment', now);

    for (const license of upcomingRenewals || []) {
      await supabaseClient
        .from('notifications')
        .insert({
          company_id: license.company_id,
          type: 'warning',
          title: 'Subscription Renewal Reminder',
          message: `Your ${license.plan_name} subscription will renew on ${new Date(license.next_payment).toLocaleDateString()}`,
        });
    }

    // Suspend overdue accounts
    await supabaseClient
      .from('licenses')
      .update({ 
        status: 'suspended',
        updated_at: now
      })
      .eq('status', 'past_due')
      .lt('grace_period_end', now);

    console.log('Billing scheduler completed successfully');

    return new Response(
      JSON.stringify({ 
        success: true, 
        processed_at: now,
        upcoming_renewals: upcomingRenewals?.length || 0
      }),
      { 
        headers: { "Content-Type": "application/json" },
        status: 200 
      }
    );
  } catch (error) {
    console.error('Billing scheduler error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { "Content-Type": "application/json" },
        status: 500 
      }
    );
  }
});
