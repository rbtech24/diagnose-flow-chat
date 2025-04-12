
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { parseDate, formatDateForSupabase } from "@/utils/dateUtils";

export interface SystemMessage {
  id: string;
  title: string;
  message: string;
  type: string;
  audience: string;
  scheduled: string;
  start_date?: string | null;
  end_date?: string | null;
  active: boolean;
  created_at: string;
  created_by?: string | null;
  updated_at: string;
}

export function useSystemMessagesData() {
  const [messages, setMessages] = useState<SystemMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchMessages = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('system_messages')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      setMessages(data || []);
    } catch (error) {
      console.error('Error fetching system messages:', error);
      toast({
        description: "Failed to load system messages",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const createMessage = async (messageData: Omit<SystemMessage, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      // Format date fields if they exist
      const formattedData = {
        ...messageData,
        start_date: messageData.start_date ? formatDateForSupabase(messageData.start_date) : null,
        end_date: messageData.end_date ? formatDateForSupabase(messageData.end_date) : null
      };

      const { data, error } = await supabase
        .from('system_messages')
        .insert([formattedData])
        .select()
        .single();

      if (error) throw error;
      
      setMessages(prev => [data, ...prev]);
      
      toast({
        description: "System message created successfully",
      });
      
      return data;
    } catch (error) {
      console.error('Error creating system message:', error);
      toast({
        description: "Failed to create system message",
        variant: "destructive",
      });
      return null;
    }
  };

  const updateMessage = async (id: string, messageData: Partial<SystemMessage>) => {
    try {
      // Format date fields if they exist
      const formattedData = Object.entries(messageData).reduce((acc, [key, value]) => {
        if ((key === 'start_date' || key === 'end_date') && value) {
          acc[key] = formatDateForSupabase(value as string);
        } else if (key === 'created_at' || key === 'updated_at') {
          // Skip these fields
        } else {
          acc[key] = value;
        }
        return acc;
      }, {} as Record<string, any>);

      const { data, error } = await supabase
        .from('system_messages')
        .update(formattedData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      setMessages(prev => prev.map(msg => msg.id === id ? data : msg));
      
      toast({
        description: "System message updated successfully",
      });
      
      return data;
    } catch (error) {
      console.error('Error updating system message:', error);
      toast({
        description: "Failed to update system message",
        variant: "destructive",
      });
      return null;
    }
  };

  const deleteMessage = async (id: string) => {
    try {
      const { error } = await supabase
        .from('system_messages')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setMessages(prev => prev.filter(msg => msg.id !== id));
      
      toast({
        description: "System message deleted successfully",
      });
      
      return true;
    } catch (error) {
      console.error('Error deleting system message:', error);
      toast({
        description: "Failed to delete system message",
        variant: "destructive",
      });
      return false;
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  return {
    messages,
    isLoading,
    fetchMessages,
    createMessage,
    updateMessage,
    deleteMessage
  };
}
