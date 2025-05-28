
import { supabase } from "@/integrations/supabase/client";

export interface PaymentIntent {
  id: string;
  amount: number;
  currency: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  payment_method?: string;
  metadata?: Record<string, any>;
}

export interface PaymentResult {
  success: boolean;
  payment_intent?: PaymentIntent;
  error?: string;
}

// Helper function to safely convert Json to Record<string, any>
function parseJsonToRecord(json: any): Record<string, any> {
  if (json === null || json === undefined) {
    return {};
  }
  if (typeof json === 'object' && !Array.isArray(json)) {
    return json as Record<string, any>;
  }
  return {};
}

// Helper function to safely get payment method type
function getPaymentMethodType(paymentMethod: any): string | undefined {
  const parsed = parseJsonToRecord(paymentMethod);
  return parsed.type;
}

export class PaymentService {
  static async createPaymentIntent(
    amount: number,
    currency: string = 'USD',
    metadata?: Record<string, any>
  ): Promise<PaymentResult> {
    try {
      // Store payment transaction in database
      const { data, error } = await supabase
        .from('payment_transactions')
        .insert({
          amount,
          currency,
          status: 'pending',
          metadata: metadata || {}
        })
        .select()
        .single();

      if (error) throw error;

      return {
        success: true,
        payment_intent: {
          id: data.id,
          amount: data.amount,
          currency: data.currency,
          status: data.status as PaymentIntent['status'],
          metadata: parseJsonToRecord(data.metadata)
        }
      };
    } catch (error) {
      console.error('Error creating payment intent:', error);
      return {
        success: false,
        error: (error as Error).message
      };
    }
  }

  static async confirmPayment(
    paymentIntentId: string,
    paymentMethod: string
  ): Promise<PaymentResult> {
    try {
      // Update payment status to processing
      const { data, error } = await supabase
        .from('payment_transactions')
        .update({
          status: 'processing',
          payment_method: { type: paymentMethod }
        })
        .eq('id', paymentIntentId)
        .select()
        .single();

      if (error) throw error;

      // Simulate payment processing delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Mark as completed (in real implementation, this would be handled by webhook)
      const { data: completedData, error: completedError } = await supabase
        .from('payment_transactions')
        .update({ status: 'completed' })
        .eq('id', paymentIntentId)
        .select()
        .single();

      if (completedError) throw completedError;

      return {
        success: true,
        payment_intent: {
          id: completedData.id,
          amount: completedData.amount,
          currency: completedData.currency,
          status: completedData.status as PaymentIntent['status'],
          payment_method: paymentMethod,
          metadata: parseJsonToRecord(completedData.metadata)
        }
      };
    } catch (error) {
      console.error('Error confirming payment:', error);
      
      // Mark payment as failed
      await supabase
        .from('payment_transactions')
        .update({ status: 'failed' })
        .eq('id', paymentIntentId);

      return {
        success: false,
        error: (error as Error).message
      };
    }
  }

  static async getPaymentHistory(companyId?: string): Promise<PaymentIntent[]> {
    try {
      let query = supabase
        .from('payment_transactions')
        .select('*')
        .order('created_at', { ascending: false });

      if (companyId) {
        query = query.eq('company_id', companyId);
      }

      const { data, error } = await query;

      if (error) throw error;

      return data.map(payment => ({
        id: payment.id,
        amount: payment.amount,
        currency: payment.currency,
        status: payment.status as PaymentIntent['status'],
        payment_method: getPaymentMethodType(payment.payment_method),
        metadata: parseJsonToRecord(payment.metadata)
      }));
    } catch (error) {
      console.error('Error fetching payment history:', error);
      return [];
    }
  }
}
