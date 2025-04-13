
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from '@/hooks/use-toast'; 

// User type definition
type User = {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'company' | 'tech';
  avatarUrl?: string;
  phone?: string;
  companyId?: string;
  status: 'active' | 'inactive' | 'pending' | 'archived' | 'deleted';
  trialEndsAt?: Date;
  subscriptionStatus?: 'trial' | 'active' | 'expired' | 'canceled';
};

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  userRole: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, data?: any) => Promise<void>;
  resetPassword: (token: string, newPassword: string) => Promise<boolean>;
  forgotPassword: (email: string) => Promise<boolean>;
  updateUser: (data: Partial<User>) => void;
  signOut: () => void;
  checkWorkflowAccess: () => boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Sign-in function (placeholder for real authentication)
  const signIn = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      // In a real implementation, this would call an authentication service
      
      toast.success('Authentication service not connected');
      setIsLoading(false);
    } catch (error) {
      toast.error('Failed to sign in');
      console.error('Sign in error:', error);
      setIsLoading(false);
    }
  };

  // Alias for signIn to maintain compatibility
  const login = signIn;

  const register = async (email: string, password: string, data?: any) => {
    try {
      setIsLoading(true);
      // In a real implementation, this would call an authentication service
      
      toast.success('Registration functionality not connected');
      setIsLoading(false);
    } catch (error) {
      toast.error('Failed to register');
      console.error('Registration error:', error);
      setIsLoading(false);
      throw error;
    }
  };

  const resetPassword = async (token: string, newPassword: string): Promise<boolean> => {
    try {
      // In a real implementation, this would reset password
      toast.success('Password reset functionality not connected');
      return true;
    } catch (error) {
      toast.error('Failed to reset password');
      console.error('Reset password error:', error);
      return false;
    }
  };

  const forgotPassword = async (email: string): Promise<boolean> => {
    try {
      // In a real implementation, this would send a password reset email
      toast.success('Password reset functionality not connected');
      return true;
    } catch (error) {
      toast.error('Failed to send reset link');
      console.error('Forgot password error:', error);
      return false;
    }
  };

  const updateUser = (data: Partial<User>) => {
    if (!user) return;
    
    const updatedUser = {...user, ...data};
    setUser(updatedUser);
    toast.success('User profile updated');
  };

  const signOut = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('user');
    toast.success('Signed out successfully');
  };

  const checkWorkflowAccess = (): boolean => {
    // In a real implementation, this would check user subscription status
    return false;
  };

  // Check for stored user on initial load
  useEffect(() => {
    // In a real implementation, this would check for an active session
    setIsLoading(false);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        userRole: user?.role || null,
        signIn,
        login,
        register,
        resetPassword,
        forgotPassword,
        updateUser,
        signOut,
        checkWorkflowAccess,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
