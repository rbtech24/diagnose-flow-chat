
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from '@/types/user';
import { supabase } from '@/integrations/supabase/client';
import { Session } from '@supabase/supabase-js';
import { fetchUserProfile, updateUserProfile } from '@/utils/supabaseClient';
import { toast } from "@/components/ui/use-toast";

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

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        
        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          if (session?.user) {
            fetchUserProfile(session.user.id).then(userData => {
              if (userData) {
                setUser(userData);
                setUserRole(userData.role as Role);
                setIsAuthenticated(true);
              }
              setIsLoading(false);
            });
          }
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          setUserRole(null);
          setIsAuthenticated(false);
          setIsLoading(false);
        }
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      
      if (session?.user) {
        fetchUserProfile(session.user.id).then(userData => {
          if (userData) {
            setUser(userData);
            setUserRole(userData.role as Role);
            setIsAuthenticated(true);
          }
          setIsLoading(false);
        });
      } else {
        setIsLoading(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

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

      if (data.user) {
        const technicianData: any = {
          id: data.user.id,
          role,
          phone,
          status: 'active',
          email
        };
        
        if (role === 'company' && phone) {
          const { data: companyData, error: companyError } = await supabase
            .from('companies')
            .insert({
              name,
              trial_status: 'active',
              subscription_tier: 'basic'
            })
            .select()
            .single();
          
          if (companyError) {
            console.error('Error creating company:', companyError);
          } else if (companyData) {
            technicianData.company_id = companyData.id;
          }
        }
        
        const { error: techError } = await supabase
          .from('technicians')
          .upsert(technicianData);
          
        if (techError) {
          console.error('Error creating technician record:', techError);
        }
      }
      
      setIsLoading(false);
    } catch (error: any) {
      console.error('Sign up error:', error);
      throw error;
    }
  };

  const updateUser = async (updates: Partial<User>): Promise<void> => {
    if (!user) return;
    
    try {
      const success = await updateUserProfile(user.id, updates);
      
      if (!success) {
        throw new Error('Failed to update user profile');
      }
      
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      
      if (updates.role) {
        setUserRole(updates.role as Role);
      }
    } catch (error: any) {
      console.error('Update user error:', error);
      throw error;
    }
  };

  const checkWorkflowAccess = (categoryId: string, workflowId: string): { hasAccess: boolean; message?: string } => {
    if (userRole === 'admin') {
      return { hasAccess: true };
    }
    
    return { hasAccess: false, message: "You don't have permission to access this workflow" };
  };

  const login = async (email: string, password: string): Promise<void> => {
    return signIn(email, password);
  }

  const logout = async (): Promise<void> => {
    return signOut();
  }
  
  const register = async (userData: { name: string; email: string; password: string; role: string; phone?: string; companyName?: string }): Promise<void> => {
    try {
      setIsLoading(true);
      
      const role = userData.role as Role;
      
      const metadata: any = {
        name: userData.name,
        role: role,
        phone: userData.phone
      };
      
      if (userData.companyName) {
        metadata.company_name = userData.companyName;
      }
      
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

      if (data.user) {
        const technicianData: any = {
          id: data.user.id,
          email: userData.email,
          role: userData.role,
          phone: userData.phone,
          status: 'active'
        };
        
        if (role === 'company' && userData.companyName) {
          const { data: companyData, error: companyError } = await supabase
            .from('companies')
            .insert({
              name: userData.companyName,
              trial_status: 'active',
              subscription_tier: 'basic'
            })
            .select()
            .single();
          
          if (companyError) {
            console.error('Error creating company:', companyError);
          } else if (companyData) {
            technicianData.company_id = companyData.id;
          }
        }
        
        const { error: techError } = await supabase
          .from('technicians')
          .upsert(technicianData);
          
        if (techError) {
          console.error('Error creating technician record:', techError);
        }
      }
      
      setIsLoading(false);
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
