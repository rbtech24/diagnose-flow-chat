
import { supabase } from '@/integrations/supabase/client';
import { PostgrestError } from '@supabase/supabase-js';

export interface SupabaseResult<T> {
  success: boolean;
  data?: T;
  error?: PostgrestError | Error;
}

export class SupabaseIntegration {
  static async safeQuery<T>(
    queryFn: () => Promise<{ data: T | null; error: PostgrestError | null }>
  ): Promise<SupabaseResult<T>> {
    try {
      const { data, error } = await queryFn();
      
      if (error) {
        console.error('Supabase query error:', error);
        return { success: false, error };
      }
      
      return { success: true, data: data || undefined };
    } catch (error) {
      console.error('Supabase integration error:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error : new Error('Unknown error')
      };
    }
  }

  static async safeTechnicianInsert(data: any): Promise<SupabaseResult<any>> {
    return this.safeQuery(async () => {
      const { data: result, error } = await supabase
        .from('technicians')
        .insert(data)
        .select()
        .single();
      return { data: result, error };
    });
  }

  static async safeTechnicianUpdate(id: string, data: any): Promise<SupabaseResult<any>> {
    return this.safeQuery(async () => {
      const { data: result, error } = await supabase
        .from('technicians')
        .update(data)
        .eq('id', id)
        .select()
        .single();
      return { data: result, error };
    });
  }

  static async safeTechnicianDelete(id: string): Promise<SupabaseResult<null>> {
    return this.safeQuery(async () => {
      const { data, error } = await supabase
        .from('technicians')
        .delete()
        .eq('id', id);
      return { data: null, error };
    });
  }

  static async safeCompanyInsert(data: any): Promise<SupabaseResult<any>> {
    return this.safeQuery(async () => {
      const { data: result, error } = await supabase
        .from('companies')
        .insert(data)
        .select()
        .single();
      return { data: result, error };
    });
  }

  static async safeCompanyUpdate(id: string, data: any): Promise<SupabaseResult<any>> {
    return this.safeQuery(async () => {
      const { data: result, error } = await supabase
        .from('companies')
        .update(data)
        .eq('id', id)
        .select()
        .single();
      return { data: result, error };
    });
  }

  static setupRealtimeSubscription<T>(
    table: string,
    callback: (payload: any) => void,
    filters?: { column: string; value: string }[]
  ) {
    let channel = supabase.channel(`${table}-changes`);
    
    if (filters) {
      filters.forEach(filter => {
        channel = channel.on('postgres_changes', {
          event: '*',
          schema: 'public',
          table,
          filter: `${filter.column}=eq.${filter.value}`
        }, callback);
      });
    } else {
      channel = channel.on('postgres_changes', {
        event: '*',
        schema: 'public',
        table
      }, callback);
    }
    
    channel.subscribe();
    
    return () => {
      supabase.removeChannel(channel);
    };
  }
}
