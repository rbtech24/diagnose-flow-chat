
import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';

export type MessageType = 'info' | 'warning' | 'error' | 'success';
export type UserRole = 'admin' | 'company' | 'tech';

export interface SystemMessage {
  id: string;
  type: MessageType;
  title: string;
  message: string;
  dismissible?: boolean;
  audience?: UserRole[]; // Which user roles should see this message
  expiresAt?: Date; // When should this message expire
}

interface SystemMessageContextValue {
  messages: SystemMessage[];
  addMessage: (message: Omit<SystemMessage, 'id'>) => string;
  removeMessage: (id: string) => void;
  clearMessages: () => void;
}

const SystemMessageContext = createContext<SystemMessageContextValue | undefined>(undefined);

export const SystemMessageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [messages, setMessages] = useState<SystemMessage[]>([
    {
      id: '1',
      type: 'info',
      title: 'Welcome to the Admin Panel',
      message: 'You can manage all aspects of the platform from here.',
      dismissible: true,
      audience: ['admin']
    },
    {
      id: '2',
      type: 'info',
      title: 'Welcome to the Company Portal',
      message: 'You can manage your technicians and subscription from here.',
      dismissible: true,
      audience: ['company']
    },
    {
      id: '3',
      type: 'info',
      title: 'Welcome to the Tech Portal',
      message: 'You can access all your diagnostics tools from here.',
      dismissible: true,
      audience: ['tech']
    }
  ]);

  const addMessage = useCallback((message: Omit<SystemMessage, 'id'>) => {
    const id = `msg-${Date.now()}`;
    setMessages(prev => [...prev, { ...message, id }]);
    return id;
  }, []);

  const removeMessage = useCallback((id: string) => {
    setMessages(prev => prev.filter(message => message.id !== id));
  }, []);

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  return (
    <SystemMessageContext.Provider value={{ messages, addMessage, removeMessage, clearMessages }}>
      {children}
    </SystemMessageContext.Provider>
  );
};

export const useSystemMessages = () => {
  const context = useContext(SystemMessageContext);
  if (!context) {
    throw new Error('useSystemMessages must be used within a SystemMessageProvider');
  }
  return context;
};

export const useUserMessages = (role: UserRole) => {
  const { messages } = useSystemMessages();
  
  // Filter messages for this user role
  return messages.filter(message => 
    !message.audience || message.audience.includes(role)
  );
};
