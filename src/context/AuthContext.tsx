
import React, { createContext, useContext, useState, useEffect } from "react";
import { User } from "@/types/user";
import { useUserManagementStore } from "@/store/userManagementStore";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

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

  useEffect(() => {
    // Check if user is logged in from localStorage
    const checkAuth = async () => {
      const storedUser = localStorage.getItem("currentUser");
      
      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
        } catch (error) {
          console.error("Error parsing stored user:", error);
          localStorage.removeItem("currentUser");
        }
      }
      
      setIsLoading(false);
    };
    
    checkAuth();
  }, []);

  const login = async (email: string, password: string, userRole: "admin" | "company" | "tech") => {
    // In a real app, this would authenticate with a backend
    // For now, we'll just find a matching user in our store
    try {
      const foundUser = users.find(
        u => u.email.toLowerCase() === email.toLowerCase() && u.role === userRole
      );
      
      if (foundUser) {
        // In a real app, we would verify the password here
        // For demo purposes, any password will work
        setUser(foundUser);
        localStorage.setItem("currentUser", JSON.stringify(foundUser));
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
    localStorage.removeItem("currentUser");
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
