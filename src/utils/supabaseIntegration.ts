
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface SupabaseOperationResult<T = any> {
  data?: T;
  error?: string;
  success: boolean;
}

export class SupabaseIntegration {
  static async safeQuery<T>(
    operation: () => Promise<{ data: T | null; error: any }>
  ): Promise<SupabaseOperationResult<T>> {
    try {
      const { data, error } = await operation();
      
      if (error) {
        console.error('Supabase operation error:', error);
        return {
          success: false,
          error: error.message || 'Database operation failed'
        };
      }
      
      return {
        success: true,
        data: data || undefined
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('Supabase operation exception:', errorMessage);
      return {
        success: false,
        error: errorMessage
      };
    }
  }

  static async safeMutation<T>(
    operation: () => Promise<{ data: T | null; error: any }>,
    successMessage?: string,
    showToast = true
  ): Promise<SupabaseOperationResult<T>> {
    const result = await this.safeQuery(operation);
    
    if (showToast) {
      if (result.success && successMessage) {
        toast({
          title: "Success",
          description: successMessage,
          variant: "default"
        });
      } else if (!result.success) {
        toast({
          title: "Error",
          description: result.error || "Operation failed",
          variant: "destructive"
        });
      }
    }
    
    return result;
  }

  static handleRealtimeSubscription(
    table: string,
    callback: (payload: any) => void,
    event: 'INSERT' | 'UPDATE' | 'DELETE' = 'INSERT'
  ) {
    const channel = supabase
      .channel(`${table}-changes`)
      .on(
        'postgres_changes',
        {
          event,
          schema: 'public',
          table
        },
        callback
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }
}
