
import React, { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast'; 

// User type definition
type User = {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'company' | 'tech';
  avatarUrl?: string;
  phone?: string;
  companyId?: string;
  status?: 'active' | 'inactive' | 'pending' | 'archived' | 'deleted';
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

  // Mock sign-in function
  const signIn = async (email: string, password: string) => {
    try {
      // This is a mock implementation
      // In a real app, you would validate credentials with your backend
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock user data based on email domain
      let role: 'admin' | 'company' | 'tech' = 'tech';
      
      if (email.includes('admin')) {
        role = 'admin';
      } else if (email.includes('company')) {
        role = 'company';
      }
      
      const mockUser: User = {
        id: '123456',
        name: email.split('@')[0],
        email,
        role,
        avatarUrl: 'https://i.pravatar.cc/150?u=' + email,
        status: 'active',
      };
      
      // Save user in state
      setUser(mockUser);
      setIsAuthenticated(true);
      
      // Store in localStorage
      localStorage.setItem('user', JSON.stringify(mockUser));
      
      toast.success('Signed in successfully');
    } catch (error) {
      toast.error('Failed to sign in');
      console.error('Sign in error:', error);
    }
  };

  // Alias for signIn to maintain compatibility
  const login = signIn;

  const register = async (email: string, password: string, data?: any) => {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock user registration
      const role = 'tech'; // Default role for new registrations
      
      const mockUser: User = {
        id: `user-${Date.now()}`,
        name: data?.name || email.split('@')[0],
        email,
        role,
        status: 'active',
        ...data
      };
      
      // Save user in state
      setUser(mockUser);
      setIsAuthenticated(true);
      
      // Store in localStorage
      localStorage.setItem('user', JSON.stringify(mockUser));
      
      toast.success('Registration successful');
    } catch (error) {
      toast.error('Failed to register');
      console.error('Registration error:', error);
      throw error;
    }
  };

  const resetPassword = async (token: string, newPassword: string): Promise<boolean> => {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock password reset functionality
      toast.success('Password has been reset successfully');
      return true;
    } catch (error) {
      toast.error('Failed to reset password');
      console.error('Reset password error:', error);
      return false;
    }
  };

  const forgotPassword = async (email: string): Promise<boolean> => {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock forgot password functionality
      toast.success(`Password reset link has been sent to ${email}`);
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
    localStorage.setItem('user', JSON.stringify(updatedUser));
    toast.success('User profile updated');
  };

  const signOut = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('user');
    toast.success('Signed out successfully');
  };

  const checkWorkflowAccess = (): boolean => {
    // Mock implementation - in a real app, this would check user subscription status
    if (!user) return false;
    
    // Admin users always have access
    if (user.role === 'admin') return true;
    
    // Other roles have access based on subscription status
    return user.subscriptionStatus === 'active' || user.subscriptionStatus === 'trial';
  };

  // Check for stored user on initial load
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser) as User;
        setUser(parsedUser);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('user');
      }
    }
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
