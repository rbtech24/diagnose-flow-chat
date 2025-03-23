import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Role } from '@/types/user';
import { supabase } from '@/integrations/supabase/client';

interface AuthContextType {
  user: User | null;
  userRole: Role | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: (email: string) => Promise<void>;
  signOut: () => Promise<void>;
  signUp: (email: string, password: string, name: string, role: Role) => Promise<void>;
  updateUser: (updates: Partial<User>) => Promise<void>;
  checkWorkflowAccess: (categoryId: string, workflowId: string) => boolean;
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

  useEffect(() => {
    const session = supabase.auth.getSession();

    supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.session?.user) {
        const { data: profile, error } = await supabase
          .from('profiles')
          .select(`id, name, email, role, avatar_url`)
          .eq('id', session.session.user.id)
          .single();

        if (error) {
          console.error('Error fetching user profile:', error);
          setIsLoading(false);
          return;
        }

        if (profile) {
          const userProfile: User = {
            id: profile.id,
            name: profile.name || 'User',
            email: profile.email,
            role: profile.role as Role,
            avatarUrl: profile.avatar_url || '',
          };

          setUser(userProfile);
          setUserRole(userProfile.role);
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } else {
        setUser(null);
        setUserRole(null);
        setIsAuthenticated(false);
      }
      setIsLoading(false);
    });

    if (session) {
      supabase.auth.getUser()
        .then(async (res) => {
          if (res?.data?.user) {
            const { data: profile, error } = await supabase
              .from('profiles')
              .select(`id, name, email, role, avatar_url`)
              .eq('id', res.data.user.id)
              .single();

            if (error) {
              console.error('Error fetching user profile:', error);
              setIsLoading(false);
              return;
            }

            if (profile) {
              const userProfile: User = {
                id: profile.id,
                name: profile.name || 'User',
                email: profile.email,
                role: profile.role as Role,
                avatarUrl: profile.avatar_url || '',
              };

              setUser(userProfile);
              setUserRole(userProfile.role);
              setIsAuthenticated(true);
            } else {
              setIsAuthenticated(false);
            }
          } else {
            setUser(null);
            setUserRole(null);
            setIsAuthenticated(false);
          }
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }
  }, [navigate]);

  const signIn = async (email: string): Promise<void> => {
    try {
      const { error } = await supabase.auth.signInWithOtp({ email });
      if (error) throw error;
      alert('Check your email for the login link!');
    } catch (error: any) {
      alert(error.error_description || error.message);
    }
  };

  const signOut = async (): Promise<void> => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setUser(null);
      setUserRole(null);
      setIsAuthenticated(false);
      navigate('/');
    } catch (error: any) {
      alert(error.error_description || error.message);
    }
  };

  const signUp = async (email: string, password: string, name: string, role: Role): Promise<void> => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
          data: {
            name: name,
            role: role,
          },
        },
      });
      if (error) throw error;

      if (data.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([
            {
              id: data.user.id,
              email: email,
              name: name,
              role: role,
            },
          ]);

        if (profileError) throw profileError;
      }

      alert('Check your email to verify your account!');
    } catch (error: any) {
      alert(error.error_description || error.message);
    }
  };

  const updateUser = async (updates: Partial<User>): Promise<void> => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user?.id);

      if (error) throw error;

      setUser({ ...user!, ...updates });
    } catch (error: any) {
      alert(error.error_description || error.message);
    }
  };

  const checkWorkflowAccess = (categoryId: string, workflowId: string) => {
    // If user is admin, they have access to all workflows
    if (userRole === 'admin') {
      return true;
    }
    
    // For other roles, check if the workflow is in their allowed set
    return false;
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
