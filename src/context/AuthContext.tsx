
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@/types/user';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface AuthContextType {
  user: User | null;
  session: any | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  signUp: (email: string, password: string, userData?: any) => Promise<boolean>;
  updateUser?: (userData: Partial<User>) => Promise<void>;
  isLoading: boolean;
  isSessionValid: () => boolean;
  getSessionTimeRemaining: () => number;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        
        setSession(session);
        
        if (session?.user) {
          // Try to fetch user profile from technicians table
          try {
            const { data: technicianData, error } = await supabase
              .from('technicians')
              .select('*')
              .eq('id', session.user.id)
              .single();

            if (technicianData && !error) {
              const userData: User = {
                id: technicianData.id,
                name: session.user.email?.split('@')[0] || 'User',
                email: technicianData.email || session.user.email || '',
                role: technicianData.role as 'admin' | 'company' | 'tech',
                companyId: technicianData.company_id,
                status: technicianData.status,
                avatarUrl: undefined,
                activeJobs: 0,
              };
              setUser(userData);
            } else {
              console.error('Error fetching technician data:', error);
              // If we can't fetch from technicians table, create a basic user object
              const userData: User = {
                id: session.user.id,
                name: session.user.email?.split('@')[0] || 'User',
                email: session.user.email || '',
                role: 'tech', // Default role
                companyId: undefined,
                status: 'active',
                avatarUrl: undefined,
                activeJobs: 0,
              };
              setUser(userData);
            }
          } catch (error) {
            console.error('Error in auth state change:', error);
            // Create basic user object as fallback
            const userData: User = {
              id: session.user.id,
              name: session.user.email?.split('@')[0] || 'User',
              email: session.user.email || '',
              role: 'tech',
              companyId: undefined,
              status: 'active',
              avatarUrl: undefined,
              activeJobs: 0,
            };
            setUser(userData);
          }
        } else {
          setUser(null);
        }
        
        setIsLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        setIsLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    console.log('Attempting login for:', email);
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        console.error('Login error:', error);
        
        // Provide specific error messages for common issues
        let errorMessage = error.message;
        if (error.message.includes('permission denied') || error.message.includes('Database error')) {
          errorMessage = 'Database configuration issue. Please check your Supabase settings or contact support.';
        } else if (error.message.includes('Invalid login credentials')) {
          errorMessage = 'Invalid email or password. Please check your credentials.';
        }
        
        toast({
          title: "Login failed",
          description: errorMessage,
          variant: "destructive",
        });
        setIsLoading(false);
        return false;
      }

      if (data.user) {
        console.log('Login successful for user:', data.user.email);
        return true;
      }

      setIsLoading(false);
      return false;
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: "Login failed",
        description: "An unexpected error occurred. Please try again or contact support.",
        variant: "destructive",
      });
      setIsLoading(false);
      return false;
    }
  };

  const signUp = async (email: string, password: string, userData?: any): Promise<boolean> => {
    console.log('Demo sign up attempt for:', email);
    
    toast({
      title: "Demo Sign Up",
      description: "Sign up successful! In a real app, this would create your account.",
    });
    
    return true;
  };

  const updateUser = async (userData: Partial<User>): Promise<void> => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      
      try {
        // Only update fields that exist in the technicians table
        const updateData: any = {};
        if (userData.email) updateData.email = userData.email;
        if (userData.status) updateData.status = userData.status;
        if (userData.role) updateData.role = userData.role;
        
        await supabase
          .from('technicians')
          .update(updateData)
          .eq('id', user.id);
        
        console.log('User updated:', updatedUser);
      } catch (error) {
        console.error('Error updating user:', error);
      }
    }
  };

  const logout = async (): Promise<void> => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Logout error:', error);
      }
      setUser(null);
      setSession(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const isSessionValid = (): boolean => {
    return !!session && !!user;
  };

  const getSessionTimeRemaining = (): number => {
    if (!session) return 0;
    const expiresAt = new Date(session.expires_at || 0).getTime();
    return Math.max(0, expiresAt - Date.now());
  };

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
