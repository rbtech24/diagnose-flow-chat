import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { User as AppUser } from '@/types/user';
import { useErrorHandler } from '@/hooks/useErrorHandler';
import { 
  loginRateLimiter, 
  SessionManager, 
  TokenSecurity, 
  PasswordSecurity 
} from '@/utils/rateLimiter';

interface AuthContextType {
  user: AppUser | null;
  session: Session | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  signUp: (email: string, password: string, userData?: Partial<AppUser>) => Promise<boolean>;
  refreshSession: () => Promise<void>;
  isSessionValid: () => boolean;
  getSessionTimeRemaining: () => number;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { handleError } = useErrorHandler();

  const fetchUserProfile = async (authUser: User): Promise<AppUser | null> => {
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

      return {
        id: data.id,
        name: authUser.email?.split('@')[0] || 'Unknown',
        email: data.email || authUser.email || '',
        role: (data.role as 'admin' | 'company' | 'tech') || 'tech',
        companyId: data.company_id || '',
        status: data.status || 'active',
        avatarUrl: authUser.user_metadata?.avatar_url,
        activeJobs: 0
      };
    } catch (error) {
      handleError(error, 'fetchUserProfile', { showToast: false });
      return null;
    }
  };

  const refreshSession = useCallback(async (): Promise<void> => {
    try {
      const { data, error } = await supabase.auth.refreshSession();
      if (error) {
        console.error('Failed to refresh session:', error);
        // Force logout on refresh failure
        await logout();
      } else if (data.session) {
        setSession(data.session);
        SessionManager.updateLastActivity();
      }
    } catch (error) {
      console.error('Session refresh error:', error);
      await logout();
    }
  }, []);

  const isSessionValid = useCallback((): boolean => {
    if (!session) return false;
    
    // Check if session is expired
    if (!SessionManager.isSessionValid(session)) {
      return false;
    }
    
    // Check for inactivity timeout - get lastActivity as number and pass as number
    const lastActivity = SessionManager.getLastActivity();
    if (SessionManager.isSessionExpired(lastActivity)) {
      return false;
    }
    
    return true;
  }, [session]);

  const getSessionTimeRemaining = useCallback((): number => {
    if (!session?.expires_at) return 0;
    const expiresAt = new Date(session.expires_at).getTime();
    return Math.max(0, expiresAt - Date.now());
  }, [session]);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);

      // Check rate limiting
      const rateLimitResult = loginRateLimiter.check(email);
      if (!rateLimitResult.allowed) {
        const resetTime = new Date(rateLimitResult.resetTime || Date.now());
        throw new Error(`Too many login attempts. Please try again after ${resetTime.toLocaleTimeString()}`);
      }

      // Validate password strength for security awareness
      const passwordValidation = PasswordSecurity.validateStrength(password);
      if (!passwordValidation.isValid) {
        console.warn('Weak password detected during login');
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.toLowerCase().trim(),
        password
      });

      if (error) {
        handleError(error, 'login');
        return false;
      }

      if (data.session) {
        // Validate token format
        if (!TokenSecurity.validateTokenFormat(data.session.access_token)) {
          throw new Error('Invalid token format received');
        }

        // Reset rate limiter on successful login
        loginRateLimiter.reset(email);
        SessionManager.updateLastActivity();
      }

      return true;
    } catch (error) {
      handleError(error, 'login');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, password: string, userData?: Partial<AppUser>): Promise<boolean> => {
    try {
      setIsLoading(true);

      // Validate password strength
      const passwordValidation = PasswordSecurity.validateStrength(password);
      if (!passwordValidation.isValid) {
        throw new Error(passwordValidation.errors.join('. '));
      }

      const { data, error } = await supabase.auth.signUp({
        email: email.toLowerCase().trim(),
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: userData
        }
      });

      if (error) {
        handleError(error, 'signUp');
        return false;
      }

      return true;
    } catch (error) {
      handleError(error, 'signUp');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      // Clear session storage
      sessionStorage.removeItem('lastActivity');
      
      const { error } = await supabase.auth.signOut();
      if (error) {
        handleError(error, 'logout');
      }
      
      // Force clear state
      setSession(null);
      setUser(null);
    } catch (error) {
      handleError(error, 'logout');
    }
  };

  // Set up automatic token refresh
  useEffect(() => {
    if (!session?.expires_at) return;

    const checkTokenRefresh = () => {
      if (TokenSecurity.shouldRefreshToken(session.expires_at)) {
        refreshSession();
      }
    };

    // Check every minute
    const interval = setInterval(checkTokenRefresh, 60 * 1000);
    return () => clearInterval(interval);
  }, [session, refreshSession]);

  // Set up inactivity monitoring
  useEffect(() => {
    const handleActivity = () => {
      if (session) {
        SessionManager.updateLastActivity();
      }
    };

    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    events.forEach(event => document.addEventListener(event, handleActivity, true));

    // Check for inactivity every minute
    const inactivityCheck = setInterval(() => {
      if (session && !isSessionValid()) {
        console.warn('Session expired due to inactivity');
        logout();
      }
    }, 60 * 1000);

    return () => {
      events.forEach(event => document.removeEventListener(event, handleActivity, true));
      clearInterval(inactivityCheck);
    };
  }, [session, isSessionValid, logout]);

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        
        setSession(session);
        
        if (session?.user) {
          // Update activity tracking
          SessionManager.updateLastActivity();
          
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

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        // Validate existing session
        if (SessionManager.isSessionValid(session)) {
          setSession(session);
          SessionManager.updateLastActivity();
          fetchUserProfile(session.user).then((userProfile) => {
            setUser(userProfile);
            setIsLoading(false);
          });
        } else {
          // Session expired, clear it
          logout();
        }
      } else {
        setIsLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const value: AuthContextType = {
    user,
    session,
    isLoading,
    login,
    logout,
    signUp,
    refreshSession,
    isSessionValid,
    getSessionTimeRemaining
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
