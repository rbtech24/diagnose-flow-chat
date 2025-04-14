
import React, { createContext, useState, useContext, useEffect, ReactNode } from "react";
import { User } from "@/types/user";
import { toast } from "react-hot-toast";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  userRole: "admin" | "company" | "tech" | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<boolean>;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Simulated authentication for demo purposes
  useEffect(() => {
    // Simulate loading user data
    const timer = setTimeout(() => {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser) as User;
          setUser(parsedUser);
        } catch (error) {
          console.error("Failed to parse stored user:", error);
          localStorage.removeItem("user");
        }
      }
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const signIn = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Demo authentication logic
      // In a real app, this would be an API call to your auth service
      if (email.includes('admin')) {
        const adminUser: User = {
          id: "admin-123",
          name: "Admin User",
          email: email,
          role: "admin",
          status: "active",
          avatarUrl: "https://i.pravatar.cc/150?u=admin"
        };
        setUser(adminUser);
        localStorage.setItem("user", JSON.stringify(adminUser));
        toast.success("Welcome, Admin!");
        return true;
      } else if (email.includes('company')) {
        const companyUser: User = {
          id: "company-123",
          name: "Company Manager",
          email: email,
          role: "company",
          status: "active",
          companyId: "comp-123",
          avatarUrl: "https://i.pravatar.cc/150?u=company"
        };
        setUser(companyUser);
        localStorage.setItem("user", JSON.stringify(companyUser));
        toast.success("Welcome, Company Manager!");
        return true;
      } else if (email.includes('tech')) {
        const techUser: User = {
          id: "tech-123",
          name: "Technician",
          email: email,
          role: "tech",
          status: "active",
          companyId: "comp-123",
          avatarUrl: "https://i.pravatar.cc/150?u=tech"
        };
        setUser(techUser);
        localStorage.setItem("user", JSON.stringify(techUser));
        toast.success("Welcome, Technician!");
        return true;
      } else {
        toast.error("Invalid credentials");
        return false;
      }
    } catch (error) {
      console.error("SignIn error:", error);
      toast.error("Authentication failed");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = () => {
    setUser(null);
    localStorage.removeItem("user");
    toast.success("Logged out successfully");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        userRole: user?.role || null,
        isLoading,
        signIn,
        signOut
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
