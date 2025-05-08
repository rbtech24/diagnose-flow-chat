
import React, { ReactNode, useState, useEffect } from 'react';
import AuthContext from './AuthContext';

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  // Since authentication is bypassed, we'll provide a default user
  const [user] = useState({
    id: '1',
    email: 'user@example.com',
    role: 'admin'
  });
  
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading authentication state
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <AuthContext.Provider 
      value={{ 
        user,
        userRole: user?.role || null,
        isLoading,
        isAuthenticated: !!user
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
