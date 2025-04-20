
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

type UserRole = 'admin' | 'company' | 'tech' | null;

interface User {
  id: string;
  email: string;
  name?: string;
  avatarUrl?: string;
}

interface AuthContextType {
  user: User | null;
  userRole: UserRole;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, role: UserRole) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

// Create a context with a default value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider component that wraps app and provides auth context
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<UserRole>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Initialize auth state from session
  useEffect(() => {
    const checkSession = async () => {
      setIsLoading(true);
      
      try {
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
          return;
        }
        
        if (data.session) {
          const { user } = data.session;
          
          // Set user data
          setUser({
            id: user.id,
            email: user.email || '',
            name: user.user_metadata?.name,
            avatarUrl: user.user_metadata?.avatar_url
          });
          
          // Get user role from metadata or user table
          setUserRole(user.user_metadata?.role as UserRole || null);
          setIsAuthenticated(true);
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
            name: session.user.user_metadata?.name,
            avatarUrl: session.user.user_metadata?.avatar_url
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
  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        toast.error(error.message);
        throw error;
      }
      
      if (data.user) {
        toast.success('Signed in successfully');
      }
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    }
  };
  
  // Sign up handler
  const signUp = async (email: string, password: string, role: UserRole) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            role: role
          },
        }
      });
      
      if (error) {
        toast.error(error.message);
        throw error;
      }
      
      if (data.user) {
        toast.success('Signed up successfully. Please check your email for verification.');
      }
    } catch (error) {
      console.error('Sign up error:', error);
      throw error;
    }
  };
  
  // Sign out handler
  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        toast.error(error.message);
        throw error;
      }
      
      toast.success('Signed out successfully');
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  };
  
  // Reset password handler
  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      
      if (error) {
        toast.error(error.message);
        throw error;
      }
      
      toast.success('Password reset email sent');
    } catch (error) {
      console.error('Password reset error:', error);
      throw error;
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
        resetPassword
      }}
    >
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
