import React from "react";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { showToast } from "@/utils/toast-helpers";
import { User } from "@/types/user";

type AuthContextType = {
  user: User | null;
  userRole: 'admin' | 'company' | 'tech' | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<boolean>;
  signUp: (email: string, password: string, role: 'admin' | 'company' | 'tech', userData?: Record<string, any>) => Promise<boolean>;
  signOut: () => Promise<void>;
  updateUser: (data: Partial<User>) => Promise<boolean>;
  resendVerificationEmail: (email: string) => Promise<boolean>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = React.useState<User | null>(null);
  const [userRole, setUserRole] = React.useState<'admin' | 'company' | 'tech' | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);

  React.useEffect(() => {
    console.log("AuthProvider is rendering");
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth state changed:", event);
      
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email || '',
          name: session.user.user_metadata?.name || '',
          role: session.user.user_metadata?.role || 'tech',
          status: 'active',
          avatarUrl: session.user.user_metadata?.avatar_url,
          companyId: session.user.user_metadata?.company_id,
        });
        setUserRole(session.user.user_metadata?.role || 'tech');
        setIsAuthenticated(true);
        console.log("User authenticated:", session.user);
      } else {
        setUser(null);
        setUserRole(null);
        setIsAuthenticated(false);
        console.log("User not authenticated");
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log("Initial session check:", session ? "Session found" : "No session");
      
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email || '',
          name: session.user.user_metadata?.name || '',
          role: session.user.user_metadata?.role || 'tech',
          status: 'active',
          avatarUrl: session.user.user_metadata?.avatar_url,
          companyId: session.user.user_metadata?.company_id,
        });
        setUserRole(session.user.user_metadata?.role || 'tech');
        setIsAuthenticated(true);
      }
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      console.log("AuthContext: signIn called with email:", email);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        showToast.error(error.message);
        console.error("AuthContext: Sign in error:", error);
        return false;
      }

      if (data.user) {
        showToast.success('Signed in successfully');
        console.log("AuthContext: Sign in successful for:", data.user.email);
        return true;
      }

      return false;
    } catch (error: any) {
      showToast.error(error.message || 'Sign in failed');
      console.error("AuthContext: Sign in exception:", error);
      return false;
    }
  };

  const signUp = async (email: string, password: string, role: 'admin' | 'company' | 'tech', userData?: Record<string, any>) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            role: role,
            name: userData?.fullName || email.split('@')[0],
            ...(userData || {}),
          }
        }
      });

      if (error) {
        showToast.error(error.message);
        return false;
      }

      if (data.user) {
        showToast.success('Signed up successfully. Please check your email for verification.');
        return true;
      }

      return false;
    } catch (error: any) {
      showToast.error(error.message || 'Sign up failed');
      return false;
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        showToast.error(error.message);
        throw error;
      }

      showToast.success('Signed out successfully');
    } catch (error: any) {
      showToast.error(error.message || 'Sign out failed');
      throw error;
    }
  };

  const updateUser = async (data: Partial<User>) => {
    try {
      const { error } = await supabase.auth.updateUser({
        data: {
          ...data
        }
      });

      if (error) {
        showToast.error(error.message);
        return false;
      }

      showToast.success('Profile updated successfully');
      return true;
    } catch (error: any) {
      showToast.error(error.message || 'Failed to update profile');
      return false;
    }
  };

  const resendVerificationEmail = async (email: string) => {
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
      });

      if (error) {
        showToast.error(error.message);
        return false;
      }

      return true;
    } catch (error: any) {
      showToast.error(error.message || 'Failed to resend verification email');
      return false;
    }
  };

  return (
    <AuthContext.Provider 
      value={{
        user,
        userRole,
        isAuthenticated,
        isLoading,
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
