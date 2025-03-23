import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from '@/types/user';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

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
  workflowUsageStats: () => any;
  checkWorkflowAccess: (workflowId: string) => { hasAccess: boolean; message?: string };
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<'admin' | 'company' | 'tech' | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session) {
          const userData: User = {
            id: session.user.id,
            email: session.user.email || '',
            name: session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'User',
            role: (session.user.user_metadata?.role as 'admin' | 'company' | 'tech') || 'company',
            status: 'active'
          };
          
          setUser(userData);
          setUserRole(userData.role);
          setIsAuthenticated(true);
        } else {
          setUser(null);
          setUserRole(null);
          setIsAuthenticated(false);
        }
      }
    );
    
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        const userData: User = {
          id: session.user.id,
          email: session.user.email || '',
          name: session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'User',
          role: (session.user.user_metadata?.role as 'admin' | 'company' | 'tech') || 'company',
          status: 'active'
        };
        
        setUser(userData);
        setUserRole(userData.role);
        setIsAuthenticated(true);
      }
      setIsLoading(false);
    });
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) throw error;
      
      if (data.user) {
        toast({
          title: "Login successful",
          description: "You have been successfully logged in",
        });
        return true;
      }
      
      return false;
    } catch (error: any) {
      console.error('Login failed:', error);
      toast({
        title: "Login failed",
        description: error.message || "Please check your credentials",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      await supabase.auth.signOut();
      navigate('/login');
      toast({
        title: "Logged out",
        description: "You have been successfully logged out",
      });
    } catch (error: any) {
      console.error('Logout error:', error);
      toast({
        title: "Error logging out",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: any): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          data: {
            name: userData.name,
            role: userData.role || 'company',
            company_name: userData.companyName,
          }
        }
      });
      
      if (error) throw error;
      
      toast({
        title: "Registration successful",
        description: "Please check your email to confirm your account",
      });
      return true;
    } catch (error: any) {
      console.error('Registration failed:', error);
      toast({
        title: "Registration failed",
        description: error.message,
        variant: "destructive"
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const updateUserProfile = async (userData: Partial<User>): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      const { error } = await supabase.auth.updateUser({
        data: {
          name: userData.name,
          ...(userData.phone && { phone: userData.phone }),
          ...(userData.avatarUrl && { avatar_url: userData.avatarUrl })
        }
      });
      
      if (error) throw error;
      
      setUser(prev => prev ? { ...prev, ...userData } : null);
      
      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated",
      });
      return true;
    } catch (error: any) {
      console.error('Profile update failed:', error);
      toast({
        title: "Profile update failed",
        description: error.message,
        variant: "destructive"
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const forgotPassword = async (email: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      
      if (error) throw error;
      
      toast({
        title: "Password reset email sent",
        description: "Please check your inbox for instructions",
      });
      return true;
    } catch (error: any) {
      console.error('Password reset request failed:', error);
      toast({
        title: "Password reset request failed",
        description: error.message,
        variant: "destructive"
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async (token: string, newPassword: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      
      if (error) throw error;
      
      toast({
        title: "Password reset successful",
        description: "Your password has been updated successfully",
      });
      
      navigate('/login');
      return true;
    } catch (error: any) {
      console.error('Password reset failed:', error);
      toast({
        title: "Password reset failed",
        description: error.message,
        variant: "destructive"
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const workflowUsageStats = () => {
    const today = new Date();
    const mockData = {
      today: Math.floor(Math.random() * 10) + 5,
      weekly: Math.floor(Math.random() * 50) + 20,
      monthly: Math.floor(Math.random() * 200) + 80,
      allData: generateMockUsageData()
    };
    
    return mockData;
  };

  const generateMockUsageData = () => {
    const data: Record<string, { count: number }> = {};
    const today = new Date();
    
    for (let i = 0; i < 60; i++) {
      const date = new Date();
      date.setDate(today.getDate() - i);
      const dateString = date.toISOString().split('T')[0];
      
      data[dateString] = {
        count: Math.floor(Math.random() * 15) + 1
      };
    }
    
    return data;
  };

  const checkWorkflowAccess = (workflowId: string) => {
    if (!isAuthenticated) {
      return { 
        hasAccess: false, 
        message: "You must be logged in to access workflows." 
      };
    }
    
    if (userRole === 'admin') {
      return { hasAccess: true };
    }
    
    if (workflowId.includes('restricted') && userRole !== 'admin') {
      return { 
        hasAccess: false, 
        message: "This workflow requires admin privileges." 
      };
    }
    
    return { hasAccess: true };
  };

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
        workflowUsageStats,
        checkWorkflowAccess
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
