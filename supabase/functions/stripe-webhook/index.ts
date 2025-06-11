
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
  apiVersion: "2023-10-16",
});

const supabaseClient = createClient(
  Deno.env.get("SUPABASE_URL") ?? "",
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
  { auth: { persistSession: false } }
);

serve(async (req) => {
  const signature = req.headers.get("stripe-signature");
  const body = await req.text();
  
  let event;
  
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature!,
      Deno.env.get("STRIPE_WEBHOOK_SECRET")!
    );
  } catch (err) {
    console.error(`Webhook signature verification failed.`, err);
    return new Response("Webhook signature verification failed", { status: 400 });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        
        if (session.mode === 'subscription') {
          // Get subscription details
          const subscription = await stripe.subscriptions.retrieve(session.subscription as string);
          
          // Create or update license
          const { error } = await supabaseClient
            .from('licenses')
            .upsert({
              company_id: session.metadata?.user_id,
              plan_id: session.metadata?.plan_id,
              status: 'active',
              start_date: new Date().toISOString(),
              end_date: new Date(subscription.current_period_end * 1000).toISOString(),
              next_payment: new Date(subscription.current_period_end * 1000).toISOString(),
              stripe_subscription_id: subscription.id,
              stripe_customer_id: session.customer as string,
            });

          if (error) {
            console.error('Error creating license:', error);
          }
        }
        break;
      }
      
      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice;
        
        if (invoice.subscription) {
          // Record payment
          await supabaseClient
            .from('payments')
            .insert({
              license_id: invoice.subscription,
              amount: invoice.amount_paid / 100,
              currency: invoice.currency,
              status: 'completed',
              payment_date: new Date().toISOString(),
              payment_method: 'stripe',
            });
        }
        break;
      }
      
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        
        // Update license
        await supabaseClient
          .from('licenses')
          .update({
            status: subscription.status === 'active' ? 'active' : 'expired',
            end_date: new Date(subscription.current_period_end * 1000).toISOString(),
            next_payment: new Date(subscription.current_period_end * 1000).toISOString(),
          })
          .eq('stripe_subscription_id', subscription.id);
        break;
      }
      
      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        
        // Cancel license
        await supabaseClient
          .from('licenses')
          .update({
            status: 'canceled',
            end_date: new Date().toISOString(),
          })
          .eq('stripe_subscription_id', subscription.id);
        break;
      }
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error('Webhook handler error:', error);
    return new Response("Webhook handler failed", { status: 500 });
  }
});
