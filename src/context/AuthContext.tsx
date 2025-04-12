
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from '@/types/user';
import { supabase } from '@/integrations/supabase/client';
import { Session } from '@supabase/supabase-js';

// Define Role type here since we can't import it
type Role = 'admin' | 'company' | 'tech';

interface AuthContextType {
  user: User | null;
  userRole: Role | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  signUp: (email: string, password: string, name: string, role: Role, phone?: string) => Promise<void>;
  updateUser: (updates: Partial<User>) => Promise<void>;
  checkWorkflowAccess: (categoryId: string, workflowId: string) => { hasAccess: boolean; message?: string };
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (userData: { name: string; email: string; password: string; role: string; phone?: string; companyName?: string }) => Promise<void>;
  forgotPassword: (email: string) => Promise<boolean>;
  resetPassword: (token: string, newPassword: string) => Promise<boolean>;
}

// Create the context with a default undefined value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<Role | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [session, setSession] = useState<Session | null>(null);
  const navigate = useNavigate();

  // Initialize auth state
  useEffect(() => {
    // First set up the auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        
        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          // Fetch user profile data after setting basic session info
          if (session?.user) {
            fetchUserProfile(session.user.id);
          }
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          setUserRole(null);
          setIsAuthenticated(false);
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

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Fetch user profile from the database
  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching user profile:', error);
        setIsLoading(false);
        return;
      }

      if (data) {
        const userData: User = {
          id: userId,
          email: session?.user?.email || '',
          name: data.name || '',
          role: data.role as Role,
          status: data.status,
          phone: data.phone,
          avatarUrl: data.avatar_url,
          companyId: data.company_id,
          trialEndsAt: data.trial_ends_at ? new Date(data.trial_ends_at) : undefined,
          subscriptionStatus: data.subscription_status,
          planId: data.plan_id,
          isMainAdmin: data.is_main_admin
        };

        setUser(userData);
        setUserRole(userData.role);
        setIsAuthenticated(true);
      }
      
      setIsLoading(false);
    } catch (error: any) {
      console.error('Error in fetchUserProfile:', error);
      setIsLoading(false);
    }
  };

  const signIn = async (email: string, password: string): Promise<void> => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        throw error;
      }

      // Actual profile loading is handled by onAuthStateChange
    } catch (error: any) {
      console.error('Sign in error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async (): Promise<void> => {
    try {
      setIsLoading(true);
      
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        throw error;
      }
      
      // Auth state change will handle clearing the user state
      navigate('/');
    } catch (error: any) {
      console.error('Sign out error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, password: string, name: string, role: Role, phone?: string): Promise<void> => {
    try {
      setIsLoading(true);
      
      // Register user with Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            role,
            phone
          }
        }
      });

      if (error) {
        throw error;
      }

      // Update the profile with additional data
      if (data.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .update({
            name,
            role,
            phone,
            status: 'active'
          })
          .eq('id', data.user.id);

        if (profileError) {
          console.error('Error updating profile:', profileError);
        }
      }
      
      // Auth state change will handle loading the user
    } catch (error: any) {
      console.error('Sign up error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateUser = async (updates: Partial<User>): Promise<void> => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      
      // Convert from camelCase to snake_case for Supabase
      const profileUpdates: any = {};
      
      if (updates.name) profileUpdates.name = updates.name;
      if (updates.phone) profileUpdates.phone = updates.phone;
      if (updates.role) profileUpdates.role = updates.role;
      if (updates.avatarUrl) profileUpdates.avatar_url = updates.avatarUrl;
      if (updates.status) profileUpdates.status = updates.status;
      if (updates.companyId) profileUpdates.company_id = updates.companyId;
      if (updates.trialEndsAt) profileUpdates.trial_ends_at = updates.trialEndsAt;
      if (updates.subscriptionStatus) profileUpdates.subscription_status = updates.subscriptionStatus;
      if (updates.planId) profileUpdates.plan_id = updates.planId;
      if (updates.isMainAdmin !== undefined) profileUpdates.is_main_admin = updates.isMainAdmin;
      
      // Update profile in Supabase
      const { error } = await supabase
        .from('profiles')
        .update(profileUpdates)
        .eq('id', user.id);

      if (error) {
        throw error;
      }

      // Update local user state
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      
      if (updates.role) {
        setUserRole(updates.role);
      }
    } catch (error: any) {
      console.error('Update user error:', error);
      throw error;
    } finally {
      setIsLoading(false);
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
  
  const register = async (userData: { name: string; email: string; password: string; role: string; phone?: string; companyName?: string }): Promise<void> => {
    try {
      setIsLoading(true);
      
      // Convert role to the correct type
      const role = userData.role as Role;
      
      // Create metadata for company if needed
      const metadata: any = {
        name: userData.name,
        role: role,
        phone: userData.phone
      };
      
      if (userData.companyName) {
        metadata.company_name = userData.companyName;
      }
      
      // Register with Supabase
      const { data, error } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          data: metadata
        }
      });

      if (error) {
        throw error;
      }

      // Additional company setup if registering as a company
      if (role === 'company' && userData.companyName && data.user) {
        // Here you would create a company record
        // For now we'll just update the profile
        const { error: updateError } = await supabase
          .from('profiles')
          .update({
            role: 'company'
          })
          .eq('id', data.user.id);

        if (updateError) {
          console.error('Error updating profile for company:', updateError);
        }
      }
      
      // Auth state change will handle loading the user
    } catch (error: any) {
      console.error('Registration error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  
  const forgotPassword = async (email: string): Promise<boolean> => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      
      if (error) {
        console.error('Password reset error:', error);
        return false;
      }
      
      return true;
    } catch (error: any) {
      console.error('Forgot password error:', error);
      return false;
    }
  };
  
  const resetPassword = async (token: string, newPassword: string): Promise<boolean> => {
    try {
      // In a real implementation, you would use the token to verify
      // For Supabase, they handle the token flow through the URL
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });
      
      if (error) {
        console.error('Reset password error:', error);
        return false;
      }
      
      return true;
    } catch (error: any) {
      console.error('Reset password error:', error);
      return false;
    }
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
