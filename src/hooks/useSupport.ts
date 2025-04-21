
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from "@/hooks/use-toast";

export interface SupportTicket {
  id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'in-progress' | 'resolved' | 'closed';
  created_at: string;
  user_id?: string;
}

export function useSupport() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const createTicket = async (data: {
    title: string;
    description: string;
    priority: SupportTicket['priority'];
  }) => {
    try {
      setIsLoading(true);
      setError(null);

      const { data: ticket, error } = await supabase
        .from('support_tickets')
        .insert([
          {
            title: data.title,
            description: data.description,
            priority: data.priority,
            status: 'open'
          }
        ])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Success",
        description: "Support ticket created successfully",
      });

      return ticket;
    } catch (err) {
      const error = err as Error;
      setError(error);
      toast({
        title: "Error",
        description: "Failed to create support ticket",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const getTickets = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const { data: tickets, error } = await supabase
        .from('support_tickets')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      return tickets;
    } catch (err) {
      const error = err as Error;
      setError(error);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  return {
    createTicket,
    getTickets,
    isLoading,
    error
  };
}
