
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/utils/supabaseClient';

// Enhanced User type with additional properties
export interface User {
  id: string;
  email: string;
  name?: string;
  role?: 'admin' | 'company' | 'tech';
  avatarUrl?: string;
  phone?: string;
  status?: 'active' | 'inactive' | 'pending';
  companyId?: string;
}

export interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
  userRole: 'admin' | 'company' | 'tech' | null;
  login: (email: string, password: string) => Promise<void>;
  forgotPassword: (email: string) => Promise<boolean>;
  resetPassword: (token: string, newPassword: string) => Promise<boolean>;
  signOut: () => void;
  updateUser: (userData: Partial<User>) => void;
  register?: (email: string, password: string, userData: Partial<User>) => Promise<void>;
  checkWorkflowAccess?: (workflowId: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<'admin' | 'company' | 'tech' | null>(null);

  // Mock authentication functions - replace with real ones when connecting to backend
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    // Mock login - in real app, this would be a call to your authentication service
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock different user roles based on email
      let role: 'admin' | 'company' | 'tech' = 'tech';
      if (email.includes('admin')) {
        role = 'admin';
      } else if (email.includes('company')) {
        role = 'company';
      }
      
      const mockUser: User = {
        id: '123456',
        email,
        name: email.split('@')[0],
        role,
        avatarUrl: 'https://i.pravatar.cc/300',
        status: 'active'
      };
      
      setUser(mockUser);
      setUserRole(role);
      setIsAuthenticated(true);
      localStorage.setItem('auth', JSON.stringify({ user: mockUser, role }));
    } catch (error: any) {
      console.error('Login error:', error);
      throw new Error(error.message || 'Failed to sign in');
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string, userData: Partial<User>) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const role = userData.role || 'tech';
      
      const mockUser: User = {
        id: `user-${Date.now()}`,
        email,
        name: userData.name || email.split('@')[0],
        role,
        avatarUrl: userData.avatarUrl || 'https://i.pravatar.cc/300',
        status: 'active'
      };
      
      setUser(mockUser);
      setUserRole(role);
      setIsAuthenticated(true);
      localStorage.setItem('auth', JSON.stringify({ user: mockUser, role }));
    } catch (error: any) {
      console.error('Registration error:', error);
      throw new Error(error.message || 'Failed to register');
    } finally {
      setIsLoading(false);
    }
  };

  const forgotPassword = async (email: string): Promise<boolean> => {
    // Mock forgot password functionality
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      return true;
    } catch (error) {
      console.error('Forgot password error:', error);
      return false;
    }
  };

  const resetPassword = async (token: string, newPassword: string): Promise<boolean> => {
    // Mock reset password functionality
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      return true;
    } catch (error) {
      console.error('Reset password error:', error);
      return false;
    }
  };

  const signOut = () => {
    setUser(null);
    setUserRole(null);
    setIsAuthenticated(false);
    localStorage.removeItem('auth');
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      
      // Update local storage
      const authData = JSON.parse(localStorage.getItem('auth') || '{}');
      localStorage.setItem('auth', JSON.stringify({ ...authData, user: updatedUser }));
    }
  };

  const checkWorkflowAccess = async (workflowId: string): Promise<boolean> => {
    // Mock implementation
    return Promise.resolve(true);
  };

  // Check for existing session on mount
  useEffect(() => {
    const checkAuth = () => {
      const savedAuth = localStorage.getItem('auth');
      
      if (savedAuth) {
        try {
          const { user, role } = JSON.parse(savedAuth);
          setUser(user);
          setUserRole(role);
          setIsAuthenticated(true);
        } catch (e) {
          console.error('Error parsing auth data', e);
          localStorage.removeItem('auth');
        }
      }
      
      setIsLoading(false);
    };
    
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isLoading,
        user,
        userRole,
        login,
        forgotPassword,
        resetPassword,
        signOut,
        updateUser,
        register,
        checkWorkflowAccess
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
