
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    const authHeader = req.headers.get("Authorization")!;
    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser(token);
    
    if (userError || !user?.email) {
      throw new Error("User not authenticated");
    }

    const { amount, cardNumber, cardExpiry, cardCvv, planId, billingCycle, companyId } = await req.json();

    // Get Helcim API credentials from environment
    const helcimApiKey = Deno.env.get("HELCIM_API_KEY");
    const helcimApiToken = Deno.env.get("HELCIM_API_TOKEN");

    if (!helcimApiKey || !helcimApiToken) {
      throw new Error("Helcim API credentials not configured");
    }

    // Get plan details
    const { data: plan, error: planError } = await supabaseClient
      .from('subscription_plans')
      .select('*')
      .eq('id', planId)
      .single();

    if (planError || !plan) {
      throw new Error("Plan not found");
    }

    // Prepare Helcim payment request
    const helcimPayload = {
      paymentType: "purchase",
      amount: amount,
      currency: "USD",
      cardData: {
        cardNumber: cardNumber.replace(/\s+/g, ''),
        cardExpiry: cardExpiry.replace(/\D/g, ''),
        cardCVV: cardCvv
      },
      billing: {
        name: user.email,
        email: user.email
      },
      customerCode: user.id,
      invoiceNumber: `SUB-${Date.now()}`,
      description: `${plan.name} subscription - ${billingCycle}`
    };

    console.log('Processing Helcim payment...', { amount, planId, billingCycle });

    // Process payment with Helcim
    const helcimResponse = await fetch("https://api.helcim.com/v2/payment/process", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-token": helcimApiToken,
        "Accept": "application/json"
      },
      body: JSON.stringify(helcimPayload)
    });

    const helcimResult = await helcimResponse.json();

    if (!helcimResponse.ok || helcimResult.status !== "APPROVED") {
      console.error('Helcim payment failed:', helcimResult);
      throw new Error(helcimResult.response || "Payment processing failed");
    }

    console.log('Helcim payment successful:', helcimResult);

    // Create or update license
    const startDate = new Date();
    const endDate = new Date();
    if (billingCycle === 'monthly') {
      endDate.setMonth(endDate.getMonth() + 1);
    } else {
      endDate.setFullYear(endDate.getFullYear() + 1);
    }

    const { data: license, error: licenseError } = await supabaseClient
      .from('licenses')
      .upsert({
        company_id: companyId || user.id,
        plan_id: planId,
        status: 'active',
        start_date: startDate.toISOString(),
        end_date: endDate.toISOString(),
        next_payment: endDate.toISOString(),
        helcim_transaction_id: helcimResult.transactionId,
        payment_method: 'helcim'
      })
      .select()
      .single();

    if (licenseError) {
      console.error('Error creating license:', licenseError);
      throw new Error('Failed to create license after payment');
    }

    // Record payment
    const { error: paymentError } = await supabaseClient
      .from('payments')
      .insert({
        license_id: license.id,
        amount: amount / 100, // Convert cents to dollars
        currency: 'USD',
        status: 'completed',
        payment_date: new Date().toISOString(),
        payment_method: 'helcim',
        transaction_id: helcimResult.transactionId
      });

    if (paymentError) {
      console.error('Error recording payment:', paymentError);
    }

    // Create notification
    await supabaseClient
      .from('notifications')
      .insert({
        company_id: companyId || user.id,
        type: 'success',
        title: 'Payment Successful',
        message: `Your ${plan.name} subscription has been activated successfully.`
      });

    return new Response(JSON.stringify({ 
      success: true,
      transactionId: helcimResult.transactionId,
      license: license
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    console.error('Helcim payment error:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      success: false
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
