
import { useState, useEffect } from "react";
import { User } from "@/types/user";
import { Session } from '@supabase/supabase-js';
import { AuthContextType } from "@/types/auth";
import { toast } from "react-hot-toast";

// Keep only super admin for mock auth
const superAdmin: User = {
  id: "super-admin-id",
  name: "Super Admin",
  email: "admin@repairautopilot.com",
  role: "admin",
  status: "active",
  isMainAdmin: true,
};

export function useMockAuth(): AuthContextType {
  console.log("Using mock auth provider");
  
  // Default to super admin for easier testing
  const storedUser = localStorage.getItem("currentUser")
    ? JSON.parse(localStorage.getItem("currentUser")!)
    : superAdmin;
  
  const [user, setUser] = useState<User | null>(storedUser);
  const [session, setSession] = useState<Session | null>({
    access_token: "mock_token",
    refresh_token: "mock_refresh_token",
    expires_in: 3600,
    expires_at: Date.now() + 3600000,
    user: user as any,
  } as Session);
  const [isLoading, setIsLoading] = useState(false);

  // Save the user to localStorage when it changes
  useEffect(() => {
    if (user) {
      console.log("Saving user to localStorage:", user);
      localStorage.setItem("currentUser", JSON.stringify(user));
    } else {
      localStorage.removeItem("currentUser");
    }
  }, [user]);

  const signIn = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);

    // Simple mock login - only for the super admin
    try {
      let loginUser: User | null = null;

      if (email === "admin@repairautopilot.com") {
        loginUser = superAdmin;
        console.log("Super admin login successful");
      }

      if (loginUser) {
        // Mock successful login
        setUser(loginUser);
        setSession({
          access_token: "mock_token",
          refresh_token: "mock_refresh_token",
          expires_in: 3600,
          expires_at: Date.now() + 3600000,
          user: loginUser as any,
        } as Session);
        return true;
      } else {
        console.error("User not found");
        return false;
      }
    } catch (error) {
      console.error("Error signing in:", error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (
    email: string,
    password: string,
    role: "admin" | "company" | "tech",
    userData?: Record<string, any>
  ): Promise<boolean> => {
    // Mock signup
    setUser({
      id: `user-${Date.now()}`,
      name: userData?.name || email.split("@")[0],
      email,
      role,
      status: "active",
    });
    return true;
  };

  const signOut = async (): Promise<void> => {
    setUser(null);
    setSession(null);
    localStorage.removeItem("currentUser");
  };

  const updateUser = async (data: Partial<User>): Promise<boolean> => {
    if (user) {
      const updatedUser = { ...user, ...data };
      console.log("Updating user profile:", updatedUser);
      setUser(updatedUser);
      
      // Show a success message to confirm the update
      toast.success("Profile updated successfully");
      
      return true;
    }
    return false;
  };

  const resendVerificationEmail = async (email: string): Promise<boolean> => {
    // Mock implementation
    console.log(`Verification email would be resent to ${email}`);
    return true;
  };

  return {
    user,
    userRole: user?.role || null,
    isAuthenticated: !!user,
    isLoading,
    session,
    signIn,
    signUp,
    signOut,
    updateUser,
    resendVerificationEmail,
  };
}
