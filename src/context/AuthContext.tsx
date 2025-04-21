
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { showToast } from "@/utils/toast-helpers";
import { User } from "@/types/user";

// Debug log for AuthContext loading
console.log("AuthContext is being imported");

type UserRole = 'admin' | 'company' | 'tech' | null;

interface AuthContextType {
  user: User | null;
  userRole: UserRole;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<boolean>;
  login: (email: string, password: string) => Promise<boolean>; // Alias for signIn
  signUp: (email: string, password: string, role: UserRole, additionalData?: any) => Promise<void>;
  register: (email: string, password: string, additionalData?: any) => Promise<void>; // Alias for signUp
  signOut: () => Promise<void>;
  forgotPassword: (email: string) => Promise<boolean>;
  resetPassword: (token: string, newPassword: string) => Promise<boolean>;
  updateUser: (data: Partial<User>) => Promise<boolean>;
}

// Create a context with a default value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider component that wraps app and provides auth context
export function AuthProvider({ children }: { children: ReactNode }) {
  // Debug log for AuthProvider rendering
  console.log("AuthProvider is rendering");
  
  const [user, setUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<UserRole>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Initialize auth state from session
  useEffect(() => {
    console.log("AuthProvider useEffect running");
    
    const checkSession = async () => {
      setIsLoading(true);
      
      try {
        console.log("Checking user session");
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
          return;
        }
        
        if (data.session) {
          console.log("User session found");
          const { user } = data.session;
          
          // Set user data
          setUser({
            id: user.id,
            email: user.email || '',
            name: user.user_metadata?.name || '',
            avatarUrl: user.user_metadata?.avatar_url,
            role: user.user_metadata?.role as UserRole || 'tech',
            status: 'active',
            companyId: user.user_metadata?.company_id,
            subscriptionStatus: user.user_metadata?.subscription_status,
            trialEndsAt: user.user_metadata?.trial_ends_at ? new Date(user.user_metadata.trial_ends_at) : undefined
          });
          
          // Get user role from metadata or user table
          setUserRole(user.user_metadata?.role as UserRole || null);
          setIsAuthenticated(true);
        } else {
          console.log("No user session found");
        }
      } catch (error) {
        console.error('Session check error:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkSession();
    
    // Set up auth state listener
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event);
        
        if (event === 'SIGNED_IN' && session) {
          setUser({
            id: session.user.id,
            email: session.user.email || '',
            name: session.user.user_metadata?.name || '',
            avatarUrl: session.user.user_metadata?.avatar_url,
            role: session.user.user_metadata?.role as UserRole || 'tech',
            status: 'active',
            companyId: session.user.user_metadata?.company_id,
            subscriptionStatus: session.user.user_metadata?.subscription_status,
            trialEndsAt: session.user.user_metadata?.trial_ends_at ? new Date(session.user.user_metadata.trial_ends_at) : undefined
          });
          setUserRole(session.user.user_metadata?.role as UserRole || null);
          setIsAuthenticated(true);
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          setUserRole(null);
          setIsAuthenticated(false);
        }
      }
    );
    
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);
  
  // Sign in handler
  const signIn = async (email: string, password: string): Promise<boolean> => {
    try {
      console.log("Attempting to sign in:", email);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        showToast.error(error.message);
        console.error("Sign in error:", error);
        return false;
      }
      
      if (data.user) {
        showToast.success('Signed in successfully');
        console.log("Sign in successful");
        return true;
      }
      
      return false;
    } catch (error: any) {
      console.error('Sign in error:', error);
      showToast.error(error.message || 'Sign in failed');
      return false;
    }
  };
  
  // Alias for signIn
  const login = signIn;
  
  // Sign up handler
  const signUp = async (email: string, password: string, role: UserRole, additionalData: any = {}): Promise<void> => {
    try {
      console.log("Attempting to sign up:", email);
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            role: role,
            name: additionalData.fullName || additionalData.name,
            phone: additionalData.phoneNumber || additionalData.phone,
            ...additionalData
          },
        }
      });
      
      if (error) {
        showToast.error(error.message);
        console.error("Sign up error:", error);
        throw error;
      }
      
      if (data.user) {
        showToast.success('Signed up successfully. Please check your email for verification.');
        console.log("Sign up successful");
      }
    } catch (error: any) {
      console.error('Sign up error:', error);
      throw error;
    }
  };
  
  // Alias for signUp
  const register = async (email: string, password: string, additionalData: any = {}): Promise<void> => {
    return signUp(email, password, additionalData.role || 'tech', additionalData);
  };
  
  // Sign out handler
  const signOut = async () => {
    try {
      console.log("Attempting to sign out");
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        showToast.error(error.message);
        console.error("Sign out error:", error);
        throw error;
      }
      
      showToast.success('Signed out successfully');
      console.log("Sign out successful");
    } catch (error: any) {
      console.error('Sign out error:', error);
      throw error;
    }
  };
  
  // Reset password handler
  const resetPassword = async (token: string, newPassword: string): Promise<boolean> => {
    try {
      console.log("Attempting to reset password");
      const { error } = await supabase.auth.updateUser({ 
        password: newPassword 
      });
      
      if (error) {
        showToast.error(error.message);
        console.error("Password reset error:", error);
        return false;
      }
      
      showToast.success('Password has been reset successfully');
      console.log("Password reset successful");
      return true;
    } catch (error: any) {
      console.error('Password reset error:', error);
      showToast.error(error.message || 'Password reset failed');
      return false;
    }
  };
  
  // Forgot password handler
  const forgotPassword = async (email: string): Promise<boolean> => {
    try {
      console.log("Attempting to send password reset email to:", email);
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      
      if (error) {
        showToast.error(error.message);
        console.error("Forgot password error:", error);
        return false;
      }
      
      console.log("Password reset email sent");
      return true;
    } catch (error: any) {
      console.error('Forgot password error:', error);
      showToast.error(error.message || 'Failed to send reset link');
      return false;
    }
  };
  
  // Update user handler
  const updateUser = async (data: Partial<User>): Promise<boolean> => {
    try {
      console.log("Attempting to update user with data:", data);
      const { error } = await supabase.auth.updateUser({
        data: {
          ...data
        }
      });
      
      if (error) {
        showToast.error(error.message);
        console.error("Update user error:", error);
        return false;
      }
      
      showToast.success('User profile updated successfully');
      console.log("User profile updated successfully");
      return true;
    } catch (error: any) {
      console.error('Update user error:', error);
      showToast.error(error.message || 'Failed to update user profile');
      return false;
    }
  };
  
  // Create the context value object
  const contextValue: AuthContextType = {
    user,
    userRole,
    isAuthenticated,
    isLoading,
    signIn,
    login,
    signUp,
    register,
    signOut,
    resetPassword,
    forgotPassword,
    updateUser
  };
  
  console.log("AuthProvider rendering children");
  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use the auth context
export function useAuth() {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
}
