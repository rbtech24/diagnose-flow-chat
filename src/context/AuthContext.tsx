
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@/types/user';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { User as SupabaseUser, Session } from '@supabase/supabase-js';
import { useErrorHandler } from '@/hooks/useErrorHandler';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  signUp: (email: string, password: string, userData?: Partial<User>) => Promise<boolean>;
  updateUser?: (userData: Partial<User>) => Promise<void>;
  isLoading: boolean;
  isSessionValid: () => boolean;
  getSessionTimeRemaining: () => number;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const fetchUserProfile = async (authUser: SupabaseUser): Promise<User | null> => {
  try {
    const { data, error } = await supabase
      .from('technicians')
      .select('id, email, role, company_id, status, phone, created_at, updated_at')
      .eq('id', authUser.id)
      .single();

    if (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }

    // If we don't find the user in the technicians table, create a basic profile
    if (!data) {
      return {
        id: authUser.id,
        name: authUser.email?.split('@')[0] || 'User',
        email: authUser.email || '',
        role: 'tech', // Default role
        avatarUrl: authUser.user_metadata?.avatar_url,
      };
    }

    return {
      id: data.id,
      name: authUser.user_metadata?.name || authUser.email?.split('@')[0] || 'Unknown',
      email: data.email || authUser.email || '',
      role: (data.role as 'admin' | 'company' | 'tech') || 'tech',
      companyId: data.company_id || '',
      status: data.status || 'active',
      avatarUrl: authUser.user_metadata?.avatar_url,
      activeJobs: 0
    };
  } catch (error) {
    console.error('Error in fetchUserProfile:', error);
    return null;
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { handleError } = useErrorHandler();

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        toast({
          title: "Login failed",
          description: error.message,
          variant: "destructive",
        });
        return false;
      }

      return true;
    } catch (error) {
      handleError(error, 'login');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, password: string, userData?: Partial<User>): Promise<boolean> => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData,
          emailRedirectTo: `${window.location.origin}/`
        }
      });

      if (error) {
        toast({
          title: "Sign up failed",
          description: error.message,
          variant: "destructive",
        });
        return false;
      }

      toast({
        title: "Sign up successful",
        description: "Please check your email to confirm your account.",
      });
      return true;
    } catch (error) {
      handleError(error, 'signUp');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const updateUser = async (userData: Partial<User>): Promise<void> => {
    if (user) {
      try {
        // Only update Supabase user metadata if relevant data is provided
        if (userData.name || userData.avatarUrl) {
          const { error } = await supabase.auth.updateUser({
            data: {
              name: userData.name || user.name,
              avatar_url: userData.avatarUrl || user.avatarUrl
            }
          });
          
          if (error) {
            throw error;
          }
        }
        
        // Update technician record in database if applicable
        if (userData.email || userData.companyId || userData.status) {
          const { error } = await supabase
            .from('technicians')
            .update({
              email: userData.email || user.email,
              company_id: userData.companyId || user.companyId,
              status: userData.status || user.status,
            })
            .eq('id', user.id);
            
          if (error) {
            throw error;
          }
        }

        // Update local state
        setUser({ ...user, ...userData });
        
      } catch (error) {
        handleError(error, 'updateUser');
      }
    }
  };

  const logout = async (): Promise<void> => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        handleError(error, 'logout');
      }
      setUser(null);
      setSession(null);
    } catch (error) {
      handleError(error, 'logout');
    }
  };

  const isSessionValid = (): boolean => {
    if (!session) return false;
    
    const expiresAt = session.expires_at ? session.expires_at * 1000 : 0;
    return Date.now() < expiresAt;
  };

  const getSessionTimeRemaining = (): number => {
    if (!session || !session.expires_at) return 0;
    
    const expiresAt = session.expires_at * 1000;
    return Math.max(0, expiresAt - Date.now());
  };

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event);
        
        setSession(session);
        
        if (session?.user) {
          // Defer user profile fetching to avoid potential recursion
          setTimeout(async () => {
            const userProfile = await fetchUserProfile(session.user);
            setUser(userProfile);
            setIsLoading(false);
          }, 0);
        } else {
          setUser(null);
          setIsLoading(false);
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session) {
        setSession(session);
        
        const userProfile = await fetchUserProfile(session.user);
        setUser(userProfile);
      }
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{
      user,
      session,
      login,
      logout,
      signUp,
      updateUser,
      isLoading,
      isSessionValid,
      getSessionTimeRemaining
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
