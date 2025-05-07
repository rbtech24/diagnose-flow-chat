
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { User } from "@/types/user";
import { Session } from '@supabase/supabase-js';

type AuthContextType = {
  user: User | null;
  userRole: 'admin' | 'company' | 'tech' | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  session: Session | null;
  signIn: (email: string, password: string) => Promise<boolean>;
  signUp: (email: string, password: string, role: 'admin' | 'company' | 'tech', userData?: Record<string, any>) => Promise<boolean>;
  signOut: () => Promise<void>;
  updateUser: (data: Partial<User>) => Promise<boolean>;
  resendVerificationEmail: (email: string) => Promise<boolean>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  console.log("AuthProvider rendering with mock auth");
  
  // Create a mock user that's always logged in
  const mockUser: User = {
    id: "mock-user-id",
    email: "mock@example.com",
    name: "Mock User",
    role: "admin",
    status: "active"
  };

  // Set up mock authentication state
  const [user] = useState<User | null>(mockUser);
  const [userRole] = useState<'admin' | 'company' | 'tech' | null>("admin");
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated] = useState(true);
  const [session] = useState<Session | null>({
    access_token: "mock-token",
    refresh_token: "mock-refresh-token",
    user: {
      id: mockUser.id,
      email: mockUser.email,
      user_metadata: { role: mockUser.role, name: mockUser.name },
      app_metadata: {},
      aud: "authenticated"
    },
    expires_in: 3600
  } as unknown as Session);

  useEffect(() => {
    // Simulate loading completion after mount
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  // Mock auth functions that always succeed
  const signIn = async () => true;
  const signUp = async () => true;
  const signOut = async () => {};
  const updateUser = async () => true;
  const resendVerificationEmail = async () => true;

  return (
    <AuthContext.Provider 
      value={{
        user,
        userRole,
        isAuthenticated,
        isLoading,
        session,
        signIn,
        signUp,
        signOut,
        updateUser,
        resendVerificationEmail
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
