
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { User } from '@/types/user';
import { toast } from '@/hooks/use-toast';
import { getWorkflowUsageStats } from '@/utils/auth';

interface AuthContextType {
  user: User | null;
  userRole: 'admin' | 'company' | 'tech' | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (userData: any) => Promise<boolean>;
  updateUserProfile: (userData: Partial<User>) => Promise<boolean>;
  forgotPassword: (email: string) => Promise<boolean>;
  resetPassword: (token: string, newPassword: string) => Promise<boolean>;
  checkWorkflowAccess: (workflowId: string) => { hasAccess: boolean; message?: string };
  workflowUsageStats: any; // Add this for diagnostics
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  
  // For demo purposes, we'll simulate a logged-in user
  useEffect(() => {
    // Mock user for demo
    const mockUser: User = {
      id: 'user-1',
      name: 'John Doe',
      email: 'john@example.com',
      role: 'admin',
      phone: '123-456-7890',
      status: 'active'
    };
    
    setUser(mockUser);
    setIsAuthenticated(true);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // This is a mock implementation
      console.log(`Login attempt with ${email}`);
      
      // Mock successful login
      const mockUser: User = {
        id: 'user-1',
        name: 'John Doe',
        email: email,
        role: 'admin',
        status: 'active'
      };
      
      setUser(mockUser);
      setIsAuthenticated(true);
      toast.success('Successfully logged in');
      return true;
    } catch (error) {
      console.error('Login failed:', error);
      toast.error('Login failed. Please check your credentials.');
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    toast.success('Logged out successfully');
  };

  const register = async (userData: any): Promise<boolean> => {
    try {
      // This is a mock implementation
      console.log('Register user:', userData);
      
      // Mock successful registration
      toast.success('Registration successful. Please log in.');
      return true;
    } catch (error) {
      console.error('Registration failed:', error);
      toast.error('Registration failed. Please try again.');
      return false;
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
      // This is a mock implementation
      console.log('Password reset requested for:', email);
      
      toast.success('Password reset email sent. Please check your inbox.');
      return true;
    } catch (error) {
      console.error('Password reset request failed:', error);
      toast.error('Password reset request failed. Please try again.');
      return false;
    }
  };

  const resetPassword = async (token: string, newPassword: string): Promise<boolean> => {
    try {
      // This is a mock implementation
      console.log('Reset password with token:', token);
      
      toast.success('Password reset successful. Please log in with your new password.');
      return true;
    } catch (error) {
      console.error('Password reset failed:', error);
      toast.error('Password reset failed. Please try again.');
      return false;
    }
  };

  const checkWorkflowAccess = (workflowId: string) => {
    // This is a mock implementation for workflow access checks
    return { hasAccess: true };
  };

  const userRole = user?.role || null;
  
  // Add workflow usage stats
  const workflowUsageStats = getWorkflowUsageStats();

  return (
    <AuthContext.Provider
      value={{
        user,
        userRole,
        isAuthenticated,
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
