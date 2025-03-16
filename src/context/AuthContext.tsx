
import React, { createContext, useContext, useState, useEffect } from "react";
import { User } from "@/types/user";
import { useUserManagementStore } from "@/store/userManagementStore";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { 
  generateSessionId, 
  updateLastActivity, 
  hasSessionTimedOut, 
  registerSession,
  verifyLicense
} from "@/utils/auth";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string, userRole: "admin" | "company" | "tech") => Promise<boolean>;
  logout: () => Promise<void>;
  signup: (userData: any) => Promise<boolean>;
  resetPassword: (email: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { users } = useUserManagementStore();
  const { toast } = useToast();
  const [sessionId, setSessionId] = useState<string | null>(null);

  // Initialize broadcast channel for cross-tab communication
  useEffect(() => {
    const broadcastChannel = new BroadcastChannel('auth_channel');
    
    // Listen for login events from other tabs
    broadcastChannel.onmessage = (event) => {
      if (event.data.type === 'new_login' && sessionId && event.data.sessionId !== sessionId) {
        // Another tab logged in with same account, log this one out
        toast({
          title: "Logged out",
          description: "Your account was logged in on another device",
          variant: "destructive",
        });
        logout();
      }
    };
    
    return () => {
      broadcastChannel.close();
    };
  }, [sessionId, toast]);

  // Activity tracking and session timeout
  useEffect(() => {
    if (!user) return;
    
    // Update activity on user interaction
    const handleActivity = () => {
      updateLastActivity();
    };
    
    // Check for session timeout every minute
    const checkTimeout = setInterval(() => {
      if (hasSessionTimedOut()) {
        toast({
          title: "Session expired",
          description: "You have been logged out due to inactivity",
          variant: "destructive",
        });
        logout();
      }
    }, 60000); // Check every minute
    
    // Set up event listeners for user activity
    window.addEventListener('mousemove', handleActivity);
    window.addEventListener('keypress', handleActivity);
    window.addEventListener('click', handleActivity);
    window.addEventListener('touchstart', handleActivity);
    
    // Initialize activity timestamp
    updateLastActivity();
    
    return () => {
      window.removeEventListener('mousemove', handleActivity);
      window.removeEventListener('keypress', handleActivity);
      window.removeEventListener('click', handleActivity);
      window.removeEventListener('touchstart', handleActivity);
      clearInterval(checkTimeout);
    };
  }, [user, toast]);

  useEffect(() => {
    // Check if user is logged in from localStorage
    const checkAuth = async () => {
      const storedUser = localStorage.getItem("currentUser");
      
      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          
          // Verify license before setting user
          if (verifyLicense(parsedUser)) {
            setUser(parsedUser);
            // Set up session tracking
            const storedSessionId = localStorage.getItem('session_id');
            if (storedSessionId) {
              setSessionId(storedSessionId);
            } else {
              const newSessionId = registerSession();
              setSessionId(newSessionId);
            }
          } else {
            // License is invalid, log user out
            localStorage.removeItem("currentUser");
            toast({
              title: "License expired",
              description: "Your subscription has expired. Please contact support.",
              variant: "destructive",
            });
          }
        } catch (error) {
          console.error("Error parsing stored user:", error);
          localStorage.removeItem("currentUser");
        }
      }
      
      setIsLoading(false);
    };
    
    checkAuth();
  }, [toast]);

  const login = async (email: string, password: string, userRole: "admin" | "company" | "tech") => {
    // In a real app, this would authenticate with a backend
    // For now, we'll just find a matching user in our store
    try {
      const foundUser = users.find(
        u => u.email.toLowerCase() === email.toLowerCase() && u.role === userRole
      );
      
      if (foundUser) {
        // Verify license before logging in
        if (!verifyLicense(foundUser)) {
          toast({
            title: "Login failed",
            description: "Your license has expired. Please contact support.",
            variant: "destructive",
          });
          return false;
        }
        
        // In a real app, we would verify the password here
        // For demo purposes, any password will work
        setUser(foundUser);
        localStorage.setItem("currentUser", JSON.stringify(foundUser));
        
        // Register this session and broadcast to other tabs
        const newSessionId = registerSession();
        setSessionId(newSessionId);
        
        // Initialize activity tracking
        updateLastActivity();
        
        return true;
      } else {
        toast({
          title: "Login failed",
          description: "Invalid email, password, or user role. Please try again.",
          variant: "destructive",
        });
        return false;
      }
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "Login failed",
        description: "An error occurred during login. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  };

  const logout = async () => {
    // In a real app, this would sign out from the backend
    setUser(null);
    setSessionId(null);
    localStorage.removeItem("currentUser");
    localStorage.removeItem("session_id");
    localStorage.removeItem("last_activity");
  };

  const signup = async (userData: any) => {
    // In a real app, this would create a user in the backend
    try {
      // For now, we'll just pretend it worked
      toast({
        title: "Signup successful",
        description: "Your account has been created. Please sign in.",
      });
      return true;
    } catch (error) {
      console.error("Signup error:", error);
      toast({
        title: "Signup failed",
        description: "An error occurred during signup. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  };

  const resetPassword = async (email: string) => {
    try {
      // In a real app, this would send a password reset email
      // For now, we'll just check if the email exists
      const userExists = users.some(u => u.email.toLowerCase() === email.toLowerCase());
      
      if (userExists) {
        toast({
          title: "Password reset email sent",
          description: "Check your email for instructions to reset your password.",
        });
        return true;
      } else {
        toast({
          title: "Email not found",
          description: "No account found with this email address.",
          variant: "destructive",
        });
        return false;
      }
    } catch (error) {
      console.error("Password reset error:", error);
      toast({
        title: "Password reset failed",
        description: "An error occurred. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  };

  const value = {
    user,
    isLoading,
    login,
    logout,
    signup,
    resetPassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
