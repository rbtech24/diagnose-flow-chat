
import React, { createContext, useContext, useState, ReactNode } from "react";

type MessageType = "warning" | "info" | "maintenance";

export interface SystemMessageData {
  type: MessageType;
  title: string;
  message: string;
  targetUsers: ("company" | "tech" | "admin")[];
  id: string;
}

interface SystemMessageContextType {
  messages: SystemMessageData[];
  addMessage: (message: Omit<SystemMessageData, "id">) => void;
  removeMessage: (id: string) => void;
}

const SystemMessageContext = createContext<SystemMessageContextType | undefined>(undefined);

export const SystemMessageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Initialize with an empty array instead of a default maintenance message
  const [messages, setMessages] = useState<SystemMessageData[]>([]);

  const addMessage = (message: Omit<SystemMessageData, "id">) => {
    const newMessage = {
      ...message,
      id: Date.now().toString()
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const removeMessage = (id: string) => {
    setMessages(prev => prev.filter(msg => msg.id !== id));
  };

  return (
    <SystemMessageContext.Provider value={{ messages, addMessage, removeMessage }}>
      {children}
    </SystemMessageContext.Provider>
  );
};

export function useSystemMessages() {
  const context = useContext(SystemMessageContext);
  if (context === undefined) {
    throw new Error("useSystemMessages must be used within a SystemMessageProvider");
  }
  return context;
}

export function useUserMessages(userType: "company" | "tech" | "admin") {
  const { messages } = useSystemMessages();
  // Filter messages to only show messages for this user type
  return messages.filter(msg => msg.targetUsers.includes(userType));
}
