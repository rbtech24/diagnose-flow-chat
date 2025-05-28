
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

  static async safeInsert<T>(
    table: string,
    data: Partial<T>
  ): Promise<SupabaseResult<T>> {
    return this.safeQuery(() => 
      supabase.from(table).insert(data).select().single()
    );
  }

  static async safeUpdate<T>(
    table: string,
    id: string,
    data: Partial<T>
  ): Promise<SupabaseResult<T>> {
    return this.safeQuery(() => 
      supabase.from(table).update(data).eq('id', id).select().single()
    );
  }

  static async safeDelete(table: string, id: string): Promise<SupabaseResult<null>> {
    return this.safeQuery(() => 
      supabase.from(table).delete().eq('id', id)
    );
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
