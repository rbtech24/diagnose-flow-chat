
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from "@/hooks/use-toast";

export interface Comment {
  id: string;
  content: string;
  created_at: string;
  user_id?: string;
}

export function useComments() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const getTicketComments = async (ticketId: string) => {
    try {
      setIsLoading(true);
      setError(null);

      const { data: comments, error } = await supabase
        .from('ticket_comments')
        .select('*')
        .eq('ticket_id', ticketId)
        .order('created_at', { ascending: true });

      if (error) throw error;

      return comments;
    } catch (err) {
      const error = err as Error;
      setError(error);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const addTicketComment = async (ticketId: string, content: string) => {
    try {
      setIsLoading(true);
      setError(null);

      const { data: comment, error } = await supabase
        .from('ticket_comments')
        .insert([
          {
            ticket_id: ticketId,
            content
          }
        ])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Success",
        description: "Comment added successfully",
      });

      return comment;
    } catch (err) {
      const error = err as Error;
      setError(error);
      toast({
        title: "Error",
        description: "Failed to add comment",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    getTicketComments,
    addTicketComment,
    isLoading,
    error
  };
}
