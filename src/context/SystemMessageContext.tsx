
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from "@/integrations/supabase/client";

export interface SystemMessage {
  id: string;
  type: 'info' | 'warning' | 'error' | 'success';
  title: string;
  message: string;
  audience: string;
  dismissible?: boolean;
  active: boolean;
  scheduled?: string;
}

interface SystemMessageContextType {
  messages: SystemMessage[];
  addMessage: (message: Omit<SystemMessage, 'id'>) => void;
  removeMessage: (id: string) => void;
  clearMessages: () => void;
}

const SystemMessageContext = createContext<SystemMessageContextType | undefined>(undefined);

export function SystemMessageProvider({ children }: { children: ReactNode }) {
  const [messages, setMessages] = useState<SystemMessage[]>([]);

  useEffect(() => {
    // Fetch messages from Supabase on component mount
    const fetchMessages = async () => {
      try {
        const { data, error } = await supabase
          .from('system_messages')
          .select('*')
          .eq('active', true);
        
        if (error) throw error;
        
        // Transform the data to match our SystemMessage interface
        const transformedMessages: SystemMessage[] = data.map(msg => ({
          id: msg.id,
          type: msg.type as 'info' | 'warning' | 'error' | 'success',
          title: msg.title,
          message: msg.message,
          audience: msg.audience,
          dismissible: true, // Default to true
          active: msg.active,
          scheduled: msg.scheduled
        }));
        
        setMessages(transformedMessages);
      } catch (error) {
        console.error('Error fetching system messages:', error);
      }
    };
    
    fetchMessages();
    
    // Set up real-time subscription
    const subscription = supabase
      .channel('system_messages_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'system_messages' },
        (payload) => {
          // Refresh messages when there's a change
          fetchMessages();
        }
      )
      .subscribe();
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const addMessage = (message: Omit<SystemMessage, 'id'>) => {
    const newMessage = {
      ...message,
      id: crypto.randomUUID(),
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const removeMessage = (id: string) => {
    setMessages(prev => prev.filter(message => message.id !== id));
  };

  const clearMessages = () => {
    setMessages([]);
  };

  return (
    <SystemMessageContext.Provider value={{ messages, addMessage, removeMessage, clearMessages }}>
      {children}
    </SystemMessageContext.Provider>
  );
}

export function useSystemMessages() {
  const context = useContext(SystemMessageContext);
  if (context === undefined) {
    throw new Error('useSystemMessages must be used within a SystemMessageProvider');
  }
  return context;
}

export function useUserMessages(userRole: string = 'all') {
  const { messages } = useSystemMessages();
  
  // Filter messages based on user role
  return messages.filter(message => {
    const audience = message.audience.toLowerCase().split(',').map(a => a.trim());
    return audience.includes('all') || audience.includes(userRole.toLowerCase());
  });
}
