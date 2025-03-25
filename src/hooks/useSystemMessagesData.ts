
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

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
        title: "Error",
        description: "Failed to load system messages",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const createMessage = async (messageData: Omit<SystemMessage, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('system_messages')
        .insert([messageData])
        .select()
        .single();

      if (error) throw error;
      
      setMessages(prev => [data, ...prev]);
      
      toast({
        title: "Success",
        description: "System message created successfully",
      });
      
      return data;
    } catch (error) {
      console.error('Error creating system message:', error);
      toast({
        title: "Error",
        description: "Failed to create system message",
        variant: "destructive",
      });
      return null;
    }
  };

  const updateMessage = async (id: string, messageData: Partial<SystemMessage>) => {
    try {
      // Convert Date objects to strings if necessary
      const formattedData = Object.entries(messageData).reduce((acc, [key, value]) => {
        acc[key] = value instanceof Date ? value.toISOString() : value;
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
        title: "Success",
        description: "System message updated successfully",
      });
      
      return data;
    } catch (error) {
      console.error('Error updating system message:', error);
      toast({
        title: "Error",
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
        title: "Success",
        description: "System message deleted successfully",
      });
      
      return true;
    } catch (error) {
      console.error('Error deleting system message:', error);
      toast({
        title: "Error",
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
