
import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { toast } from "@/components/ui/use-toast";

type MessageType = "warning" | "info" | "maintenance" | "success";

interface SystemMessageData {
  type: MessageType;
  title: string;
  message: string;
  targetUsers: ("company" | "tech" | "admin")[];
  id: string;
  dismissible?: boolean;
  expiresAt?: Date | null;
}

interface SystemMessageContextType {
  messages: SystemMessageData[];
  addMessage: (message: Omit<SystemMessageData, "id">) => void;
  removeMessage: (id: string) => void;
  clearExpiredMessages: () => void;
}

const SystemMessageContext = createContext<SystemMessageContextType | undefined>(undefined);

export function SystemMessageProvider({ children }: { children: ReactNode }) {
  const [messages, setMessages] = useState<SystemMessageData[]>([
    {
      id: "maintenance-1",
      type: "maintenance",
      title: "Scheduled Maintenance",
      message: "System maintenance scheduled for tonight from 2AM - 4AM. Some features may be unavailable during this time.",
      targetUsers: ["company", "tech", "admin"],
      dismissible: true,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // Expires in 24 hours
    }
  ]);

  // Clear expired messages on component mount and when messages change
  useEffect(() => {
    const checkExpiredMessages = () => {
      const now = new Date();
      const expiredMessageIds = messages
        .filter(msg => msg.expiresAt && new Date(msg.expiresAt) < now)
        .map(msg => msg.id);
      
      if (expiredMessageIds.length > 0) {
        setMessages(prev => prev.filter(msg => !expiredMessageIds.includes(msg.id)));
      }
    };
    
    checkExpiredMessages();
    
    // Set up interval to check for expired messages
    const interval = setInterval(checkExpiredMessages, 60 * 1000); // Check every minute
    
    return () => clearInterval(interval);
  }, [messages]);

  const addMessage = (message: Omit<SystemMessageData, "id">) => {
    const newMessage = {
      ...message,
      id: Date.now().toString(),
      dismissible: message.dismissible ?? true
    };
    
    setMessages(prev => [...prev, newMessage]);
    
    // Show toast notification for new messages
    toast({
      title: message.title,
      description: message.message,
      variant: message.type === "warning" || message.type === "maintenance" ? "destructive" : "default",
    });
  };

  const removeMessage = (id: string) => {
    setMessages(prev => prev.filter(msg => msg.id !== id));
  };
  
  const clearExpiredMessages = () => {
    const now = new Date();
    setMessages(prev => prev.filter(msg => !msg.expiresAt || new Date(msg.expiresAt) > now));
  };

  return (
    <SystemMessageContext.Provider value={{ messages, addMessage, removeMessage, clearExpiredMessages }}>
      {children}
    </SystemMessageContext.Provider>
  );
}

export function useSystemMessages() {
  const context = useContext(SystemMessageContext);
  if (context === undefined) {
    throw new Error("useSystemMessages must be used within a SystemMessageProvider");
  }
  return context;
}

export function useUserMessages(userType: "company" | "tech" | "admin") {
  const { messages } = useSystemMessages();
  return messages.filter(msg => msg.targetUsers.includes(userType));
}
