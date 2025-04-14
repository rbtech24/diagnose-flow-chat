import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Session, AuthError } from '@supabase/supabase-js';
import { toast } from '@/hooks/use-toast'; 

// User type definition
type UserType = {
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
  user: UserType | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  userRole: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, data?: any) => Promise<void>;
  resetPassword: (token: string, newPassword: string) => Promise<boolean>;
  forgotPassword: (email: string) => Promise<boolean>;
  updateUser: (data: Partial<UserType>) => void;
  signOut: () => void;
  checkWorkflowAccess: () => boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserType | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Initialize auth and check for existing session
  useEffect(() => {
    // First set up the auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        if (session?.user) {
          // Don't make supabase calls directly in the callback
          // Use setTimeout to avoid deadlocks
          setTimeout(() => {
            fetchUserProfile(session.user.id);
          }, 0);
        } else {
          setIsAuthenticated(false);
          setUser(null);
        }
      }
    );

    // Then check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        fetchUserProfile(session.user.id);
      } else {
        setIsLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserProfile = async (userId: string) => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;

      if (data) {
        // Check for the role and status values and make sure they conform to the expected types
        const userRole = data.role as 'admin' | 'company' | 'tech';
        if (!['admin', 'company', 'tech'].includes(userRole)) {
          throw new Error(`Invalid role: ${data.role}`);
        }
        
        const userStatus = data.status as 'active' | 'inactive' | 'pending' | 'archived' | 'deleted';
        if (!['active', 'inactive', 'pending', 'archived', 'deleted'].includes(userStatus)) {
          throw new Error(`Invalid status: ${data.status}`);
        }
        
        const subscriptionStatus = data.subscription_status as 'trial' | 'active' | 'expired' | 'canceled' | undefined;
        if (data.subscription_status && !['trial', 'active', 'expired', 'canceled'].includes(subscriptionStatus!)) {
          throw new Error(`Invalid subscription status: ${data.subscription_status}`);
        }

        setUser({
          id: data.id,
          name: data.name || '',
          email: data.email,
          role: userRole,
          avatarUrl: data.avatar_url,
          phone: data.phone,
          companyId: data.company_id,
          status: userStatus,
          trialEndsAt: data.trial_ends_at ? new Date(data.trial_ends_at) : undefined,
          subscriptionStatus: subscriptionStatus
        });
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
      // If no profile exists, but we have an auth user, create a profile
      if (session?.user) {
        try {
          const newUser = {
            id: session.user.id,
            email: session.user.email || '',
            name: session.user.email?.split('@')[0] || '',
            role: 'tech' as const, // Default role
            status: 'active' as const
          };
          
          const { error } = await supabase
            .from('users')
            .insert([newUser]);
            
          if (error) throw error;
          
          setUser(newUser as UserType);
          setIsAuthenticated(true);
        } catch (createError) {
          console.error('Error creating user profile:', createError);
          toast.error('Failed to create user profile');
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Sign-in function
  const signIn = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) throw error;
      
      toast.success('Signed in successfully');
    } catch (error) {
      const authError = error as AuthError;
      toast.error(authError.message || 'Failed to sign in');
      console.error('Sign in error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Alias for signIn to maintain compatibility
  const login = signIn;

  const register = async (email: string, password: string, data?: any) => {
    try {
      setIsLoading(true);
      
      // Sign up the user
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: data?.name || email.split('@')[0],
            role: data?.role || 'tech',
            company_name: data?.companyName,
          }
        }
      });
      
      if (signUpError) throw signUpError;
      
      // If sign up successful, user profile will be created via onAuthStateChange
      toast.success('Registration successful! Please check your email to verify your account.');
    } catch (error) {
      const authError = error as AuthError;
      toast.error(authError.message || 'Failed to register');
      console.error('Registration error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async (token: string, newPassword: string): Promise<boolean> => {
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      
      if (error) throw error;
      
      toast.success('Password reset successfully');
      return true;
    } catch (error) {
      const authError = error as AuthError;
      toast.error(authError.message || 'Failed to reset password');
      console.error('Reset password error:', error);
      return false;
    }
  };

  const forgotPassword = async (email: string): Promise<boolean> => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      
      if (error) throw error;
      
      toast.success('Password reset link sent to your email');
      return true;
    } catch (error) {
      const authError = error as AuthError;
      toast.error(authError.message || 'Failed to send reset link');
      console.error('Forgot password error:', error);
      return false;
    }
  };

  const updateUser = async (data: Partial<UserType>) => {
    if (!user) return;
    
    try {
      // Update the profile in Supabase
      const { error } = await supabase
        .from('users')
        .update({
          name: data.name,
          phone: data.phone,
          avatar_url: data.avatarUrl,
          // Don't allow updating role or status through this function
        })
        .eq('id', user.id);
        
      if (error) throw error;
      
      // Update local state
      const updatedUser = {...user, ...data};
      setUser(updatedUser);
      toast.success('User profile updated');
    } catch (error) {
      console.error('Error updating user:', error);
      toast.error('Failed to update profile');
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      setUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem('user');
      toast.success('Signed out successfully');
    } catch (error) {
      console.error('Sign out error:', error);
      toast.error('Failed to sign out');
    }
  };

  const checkWorkflowAccess = (): boolean => {
    if (!user) return false;
    
    // Admin users always have access
    if (user.role === 'admin') return true;
    
    // Check subscription status for company and tech users
    if (user.role === 'company' || user.role === 'tech') {
      if (user.subscriptionStatus === 'active') return true;
      
      // Check if trial is still valid
      if (user.subscriptionStatus === 'trial' && user.trialEndsAt) {
        return new Date(user.trialEndsAt) > new Date();
      }
    }
    
    return false;
  };

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
