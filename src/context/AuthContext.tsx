
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { User } from '@/types/user';
import { toast } from '@/hooks/use-toast';
import { getWorkflowUsageStats } from '@/utils/auth';
import { supabase } from '@/integrations/supabase/client';

interface AuthContextType {
  user: User | null;
  userRole: 'admin' | 'company' | 'tech' | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (userData: any) => Promise<boolean>;
  updateUserProfile: (userData: Partial<User>) => Promise<boolean>;
  forgotPassword: (email: string) => Promise<boolean>;
  resetPassword: (token: string, newPassword: string) => Promise<boolean>;
  checkWorkflowAccess: (workflowId: string) => { hasAccess: boolean; message?: string };
  workflowUsageStats: any;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<'admin' | 'company' | 'tech' | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  // Initialize auth state on mount
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Try to get session from Supabase
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Session error:", error);
          setIsLoading(false);
          return;
        }
        
        // If we have a session, get the user
        if (session) {
          const { data: { user: authUser }, error: userError } = await supabase.auth.getUser();
          
          if (userError || !authUser) {
            console.error("User error:", userError);
            setIsLoading(false);
            return;
          }
          
          // Format user data
          const userData: User = {
            id: authUser.id,
            email: authUser.email || '',
            name: authUser.user_metadata?.name || authUser.email?.split('@')[0] || 'User',
            role: (authUser.user_metadata?.role as 'admin' | 'company' | 'tech') || 'company',
            status: 'active'
          };
          
          setUser(userData);
          setUserRole(userData.role);
          setIsAuthenticated(true);
        } else {
          // For demo purposes, simulate a logged-in user if no session
          setDemoUser();
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
        // Fall back to demo user for demo purposes
        setDemoUser();
      } finally {
        setIsLoading(false);
      }
    };
    
    initializeAuth();
    
    // Set up auth state change listener
    const authListener = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        const authUser = session.user;
        const userData: User = {
          id: authUser.id,
          email: authUser.email || '',
          name: authUser.user_metadata?.name || authUser.email?.split('@')[0] || 'User',
          role: (authUser.user_metadata?.role as 'admin' | 'company' | 'tech') || 'company',
          status: 'active'
        };
        
        setUser(userData);
        setUserRole(userData.role);
        setIsAuthenticated(true);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setUserRole(null);
        setIsAuthenticated(false);
      }
    });
    
    return () => {
      authListener.data.subscription.unsubscribe();
    };
  }, []);
  
  // Helper to set demo user for development/testing
  const setDemoUser = () => {
    const mockUser: User = {
      id: 'user-1',
      name: 'John Doe',
      email: 'john@example.com',
      role: 'admin',
      phone: '123-456-7890',
      status: 'active'
    };
    
    setUser(mockUser);
    setUserRole(mockUser.role);
    setIsAuthenticated(true);
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) throw error;
      
      if (data.user) {
        const userData: User = {
          id: data.user.id,
          email: data.user.email || '',
          name: data.user.user_metadata?.name || data.user.email?.split('@')[0] || 'User',
          role: (data.user.user_metadata?.role as 'admin' | 'company' | 'tech') || 'company',
          status: 'active'
        };
        
        setUser(userData);
        setUserRole(userData.role);
        setIsAuthenticated(true);
        toast.success('Successfully logged in');
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Login failed:', error);
      toast.error('Login failed. Please check your credentials.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      await supabase.auth.signOut();
      setUser(null);
      setUserRole(null);
      setIsAuthenticated(false);
      toast.success('Logged out successfully');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Error logging out');
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: any): Promise<boolean> => {
    try {
      setIsLoading(true);
      // This is a mock implementation
      console.log('Register user:', userData);
      
      // Mock successful registration
      toast.success('Registration successful. Please log in.');
      return true;
    } catch (error) {
      console.error('Registration failed:', error);
      toast.error('Registration failed. Please try again.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const updateUserProfile = async (userData: Partial<User>): Promise<boolean> => {
    try {
      // This is a mock implementation
      console.log('Update user profile:', userData);
      
      if (user) {
        setUser({ ...user, ...userData });
        toast.success('Profile updated successfully');
        return true;
      }
      return false;
    } catch (error) {
      console.error('Profile update failed:', error);
      toast.error('Profile update failed. Please try again.');
      return false;
    }
  };

  const forgotPassword = async (email: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      
      if (error) throw error;
      
      toast.success('Password reset email sent. Please check your inbox.');
      return true;
    } catch (error) {
      console.error('Password reset request failed:', error);
      toast.error('Password reset request failed. Please try again.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async (token: string, newPassword: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      // This is a mock implementation
      console.log('Reset password with token:', token);
      
      toast.success('Password reset successful. Please log in with your new password.');
      return true;
    } catch (error) {
      console.error('Password reset failed:', error);
      toast.error('Password reset failed. Please try again.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const checkWorkflowAccess = (workflowId: string) => {
    // This is a mock implementation for workflow access checks
    return { hasAccess: true };
  };
  
  // Add workflow usage stats
  const workflowUsageStats = getWorkflowUsageStats();

  return (
    <AuthContext.Provider
      value={{
        user,
        userRole,
        isAuthenticated,
        isLoading,
        login,
        logout,
        register,
        updateUserProfile,
        forgotPassword,
        resetPassword,
        checkWorkflowAccess,
        workflowUsageStats
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
