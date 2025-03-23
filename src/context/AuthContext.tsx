
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from '@/types/user';
import { placeholderUser } from '@/utils/placeholderData';

// Define Role type here since we can't import it
type Role = 'admin' | 'company' | 'tech';

interface AuthContextType {
  user: User | null;
  userRole: Role | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: (email: string) => Promise<void>;
  signOut: () => Promise<void>;
  signUp: (email: string, password: string, name: string, role: Role) => Promise<void>;
  updateUser: (updates: Partial<User>) => Promise<void>;
  checkWorkflowAccess: (categoryId: string, workflowId: string) => { hasAccess: boolean; message?: string };
  // Add these methods to fix the missing function errors
  login: (email: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (userData: { name: string; email: string; password: string; role: string; companyName?: string }) => Promise<void>;
  forgotPassword: (email: string) => Promise<boolean>;
  resetPassword: (token: string, newPassword: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<Role | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Simulate auth state change with dummy data
  useEffect(() => {
    const timer = setTimeout(() => {
      // For development purposes, we'll use a placeholder user
      setUser(placeholderUser);
      setUserRole(placeholderUser.role as Role);
      setIsAuthenticated(true);
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  const signIn = async (email: string): Promise<void> => {
    try {
      // Simulate sign in
      setUser(placeholderUser);
      setUserRole(placeholderUser.role as Role);
      setIsAuthenticated(true);
    } catch (error: any) {
      console.error('Sign in error:', error);
    }
  };

  const signOut = async (): Promise<void> => {
    try {
      // Simulate sign out
      setUser(null);
      setUserRole(null);
      setIsAuthenticated(false);
      navigate('/');
    } catch (error: any) {
      console.error('Sign out error:', error);
    }
  };

  const signUp = async (email: string, password: string, name: string, role: Role): Promise<void> => {
    try {
      // Simulate sign up
      const newUser: User = {
        id: `user-${Date.now()}`,
        email,
        name,
        role,
        avatarUrl: '',
      };
      
      setUser(newUser);
      setUserRole(role);
      setIsAuthenticated(true);
    } catch (error: any) {
      console.error('Sign up error:', error);
    }
  };

  const updateUser = async (updates: Partial<User>): Promise<void> => {
    try {
      // Simulate update user
      if (user) {
        const updatedUser = { ...user, ...updates };
        setUser(updatedUser);
        if (updates.role) {
          setUserRole(updates.role as Role);
        }
      }
    } catch (error: any) {
      console.error('Update user error:', error);
    }
  };

  const checkWorkflowAccess = (categoryId: string, workflowId: string): { hasAccess: boolean; message?: string } => {
    // If user is admin, they have access to all workflows
    if (userRole === 'admin') {
      return { hasAccess: true };
    }
    
    // For other roles, assume no access by default
    // In a real app, you would check against a permissions database
    return { hasAccess: false, message: "You don't have permission to access this workflow" };
  };
  
  // Add these methods to match the expected interface
  const login = signIn;
  const logout = signOut;
  
  const register = async (userData: { name: string; email: string; password: string; role: string; companyName?: string }): Promise<void> => {
    try {
      // Simulate registration
      const newUser: User = {
        id: `user-${Date.now()}`,
        email: userData.email,
        name: userData.name,
        role: userData.role as Role,
        avatarUrl: '',
      };
      
      setUser(newUser);
      setUserRole(newUser.role);
      setIsAuthenticated(true);
    } catch (error: any) {
      console.error('Registration error:', error);
    }
  };
  
  const forgotPassword = async (email: string): Promise<boolean> => {
    // Simulate password reset request
    console.log(`Password reset requested for ${email}`);
    return true;
  };
  
  const resetPassword = async (token: string, newPassword: string): Promise<boolean> => {
    // Simulate password reset
    console.log(`Password reset with token ${token}`);
    return true;
  };

  const value: AuthContextType = {
    user,
    userRole,
    isAuthenticated,
    isLoading,
    signIn,
    signOut,
    signUp,
    updateUser,
    checkWorkflowAccess,
    login,
    logout,
    register,
    forgotPassword,
    resetPassword
  };

  return (
    <AuthContext.Provider value={value}>
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
