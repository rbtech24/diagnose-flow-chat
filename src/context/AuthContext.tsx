import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/utils/supabaseClient';
import { Session, User } from '@supabase/supabase-js';
import { toast } from 'react-hot-toast';

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  userRole: 'admin' | 'company' | 'tech' | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  forgotPassword: (email: string) => Promise<boolean>;
  resetPassword: (token: string, newPassword: string) => Promise<boolean>;
  checkWorkflowAccess: (folder: string, workflowId: string) => { hasAccess: boolean, message?: string };
}

interface RegisterData {
  email: string;
  password: string;
  name: string;
  role: string;
  phone?: string;
  companyName?: string;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  user: null,
  userRole: null,
  isLoading: true,
  login: async () => {},
  signup: async () => {},
  register: async () => {},
  logout: async () => {},
  forgotPassword: async () => false,
  resetPassword: async () => false,
  checkWorkflowAccess: () => ({ hasAccess: false })
});

export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userRole, setUserRole] = useState<'admin' | 'company' | 'tech' | null>(null);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          setTimeout(() => {
            fetchUserRole(session.user.id);
          }, 0);
        } else {
          setUserRole(null);
        }
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        fetchUserRole(session.user.id);
      }
      
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchUserRole = async (userId: string) => {
    try {
      if (user?.email?.includes('admin')) {
        setUserRole('admin');
      } else if (user?.email?.includes('company')) {
        setUserRole('company');
      } else {
        setUserRole('tech');
      }
    } catch (error) {
      console.error('Error getting user role:', error);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
    } catch (error: any) {
      console.error('Login error:', error.message);
      throw error;
    }
  };

  const signup = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;
      
      toast.success("Signup successful! Check your email for confirmation.");
    } catch (error: any) {
      console.error('Signup error:', error.message);
      throw error;
    }
  };

  const register = async (data: RegisterData) => {
    try {
      const { error: signUpError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            name: data.name,
            role: data.role,
            phone: data.phone,
            company_name: data.companyName,
          },
        },
      });

      if (signUpError) throw signUpError;

      toast.success("Account created successfully!");
    } catch (error: any) {
      console.error('Registration error:', error.message);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setUserRole(null);
      toast.success("Logged out successfully");
    } catch (error: any) {
      console.error('Logout error:', error.message);
      throw error;
    }
  };

  const forgotPassword = async (email: string): Promise<boolean> => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;
      return true;
    } catch (error: any) {
      console.error('Forgot password error:', error.message);
      toast.error(error.message);
      return false;
    }
  };

  const resetPassword = async (token: string, newPassword: string): Promise<boolean> => {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) throw error;
      return true;
    } catch (error: any) {
      console.error('Reset password error:', error.message);
      toast.error(error.message);
      return false;
    }
  };

  const checkWorkflowAccess = (folder: string, workflowId: string) => {
    return { hasAccess: true };
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: !!user,
        user,
        userRole,
        isLoading,
        login,
        signup,
        register,
        logout,
        forgotPassword,
        resetPassword,
        checkWorkflowAccess,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
