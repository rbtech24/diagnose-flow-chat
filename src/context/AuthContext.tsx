
import React, { createContext, useContext, useState, useEffect } from "react";
import { User } from "@/types/user";
import { useUserManagementStore } from "@/store/userManagementStore";
import { toast } from "react-hot-toast";
import { 
  generateSessionId, 
  updateLastActivity, 
  hasSessionTimedOut, 
  registerSession,
  verifyLicense,
  trackWorkflowUsage,
  getWorkflowUsageStats
} from "@/utils/auth";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string, userRole: "admin" | "company" | "tech") => Promise<boolean>;
  logout: () => Promise<void>;
  signup: (userData: any) => Promise<boolean>;
  resetPassword: (email: string) => Promise<boolean>;
  checkWorkflowAccess: (workflowId: string) => { hasAccess: boolean, message?: string };
  workflowUsageStats: () => any;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const { users } = useUserManagementStore();

  useEffect(() => {
    const broadcastChannel = new BroadcastChannel('auth_channel');
    
    broadcastChannel.onmessage = (event) => {
      if (event.data.type === 'new_login' && sessionId && event.data.sessionId !== sessionId) {
        toast({
          title: "Logged out",
          description: "Your account was logged in on another device",
        });
        logout();
      }
    };
    
    return () => {
      broadcastChannel.close();
    };
  }, [sessionId]);

  useEffect(() => {
    if (!user) return;
    
    const handleActivity = () => {
      updateLastActivity();
    };
    
    const checkTimeout = setInterval(() => {
      if (hasSessionTimedOut()) {
        toast({
          title: "Session expired",
          description: "You have been logged out due to inactivity",
        });
        logout();
      }
    }, 60000);
    
    window.addEventListener('mousemove', handleActivity);
    window.addEventListener('keypress', handleActivity);
    window.addEventListener('click', handleActivity);
    window.addEventListener('touchstart', handleActivity);
    
    updateLastActivity();
    
    return () => {
      window.removeEventListener('mousemove', handleActivity);
      window.removeEventListener('keypress', handleActivity);
      window.removeEventListener('click', handleActivity);
      window.removeEventListener('touchstart', handleActivity);
      clearInterval(checkTimeout);
    };
  }, [user]);

  useEffect(() => {
    if (!user) return;
    
    const checkLicenseInterval = setInterval(() => {
      const licenseStatus = verifyLicense(user);
      
      if (!licenseStatus.valid) {
        toast({
          title: "License issue detected",
          description: licenseStatus.message || "Your license is no longer valid.",
        });
        logout();
      }
    }, 30 * 60 * 1000);
    
    return () => {
      clearInterval(checkLicenseInterval);
    };
  }, [user]);

  useEffect(() => {
    const checkAuth = async () => {
      const storedUser = localStorage.getItem("currentUser");
      
      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          
          const licenseStatus = verifyLicense(parsedUser);
          if (licenseStatus.valid) {
            setUser(parsedUser);
            const storedSessionId = localStorage.getItem('session_id');
            if (storedSessionId) {
              setSessionId(storedSessionId);
            } else {
              const newSessionId = registerSession();
              setSessionId(newSessionId);
            }
          } else {
            localStorage.removeItem("currentUser");
            toast({
              title: "License issue",
              description: licenseStatus.message || "Your subscription has expired. Please contact support.",
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
  }, []);

  const checkWorkflowAccess = (workflowId: string) => {
    if (!user) {
      return { hasAccess: false, message: "You must be logged in to access workflows" };
    }
    
    const licenseStatus = verifyLicense(user);
    if (!licenseStatus.valid) {
      return { hasAccess: false, message: licenseStatus.message };
    }
    
    const withinLimits = trackWorkflowUsage(workflowId);
    if (!withinLimits) {
      return { 
        hasAccess: false, 
        message: "You've reached your daily workflow usage limit. Please try again tomorrow or upgrade your plan."
      };
    }
    
    return { hasAccess: true };
  };

  const workflowUsageStats = () => {
    return getWorkflowUsageStats();
  };

  const login = async (email: string, password: string, userRole: "admin" | "company" | "tech") => {
    try {
      const foundUser = users.find(
        u => u.email.toLowerCase() === email.toLowerCase() && u.role === userRole
      );
      
      if (foundUser) {
        if (!verifyLicense(foundUser).valid) {
          toast({
            title: "Login failed",
            description: "Your license has expired. Please contact support.",
          });
          return false;
        }
        
        setUser(foundUser);
        localStorage.setItem("currentUser", JSON.stringify(foundUser));
        
        const newSessionId = registerSession();
        setSessionId(newSessionId);
        
        updateLastActivity();
        
        return true;
      } else {
        toast({
          title: "Login failed",
          description: "Invalid email, password, or user role. Please try again.",
        });
        return false;
      }
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "Login failed",
        description: "An error occurred during login. Please try again.",
      });
      return false;
    }
  };

  const logout = async () => {
    setUser(null);
    setSessionId(null);
    localStorage.removeItem("currentUser");
    localStorage.removeItem("session_id");
    localStorage.removeItem("last_activity");
  };

  const signup = async (userData: any) => {
    try {
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
      });
      return false;
    }
  };

  const resetPassword = async (email: string) => {
    try {
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
        });
        return false;
      }
    } catch (error) {
      console.error("Password reset error:", error);
      toast({
        title: "Password reset failed",
        description: "An error occurred. Please try again.",
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
    checkWorkflowAccess,
    workflowUsageStats,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
