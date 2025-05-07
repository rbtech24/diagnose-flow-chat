
import { User } from "@/types/user";
import { Session } from '@supabase/supabase-js';
import { useState, useEffect } from 'react';
import { AuthContextType } from "@/types/auth";

export function useMockAuth(): AuthContextType {
  console.log("Using mock auth provider");
  
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

  return {
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
  };
}
