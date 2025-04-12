
import React, { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast'; 

// User type definition
type User = {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'company' | 'tech';
  avatarUrl?: string;
};

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  userRole: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // Mock sign-in function
  const signIn = async (email: string, password: string) => {
    try {
      // This is a mock implementation
      // In a real app, you would validate credentials with your backend
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock user data based on email domain
      let role: 'admin' | 'company' | 'tech' = 'tech';
      
      if (email.includes('admin')) {
        role = 'admin';
      } else if (email.includes('company')) {
        role = 'company';
      }
      
      const mockUser: User = {
        id: '123456',
        name: email.split('@')[0],
        email,
        role,
        avatarUrl: 'https://i.pravatar.cc/150?u=' + email,
      };
      
      // Save user in state
      setUser(mockUser);
      setIsAuthenticated(true);
      
      // Store in localStorage
      localStorage.setItem('user', JSON.stringify(mockUser));
      
      toast.success('Signed in successfully');
    } catch (error) {
      toast.error('Failed to sign in');
      console.error('Sign in error:', error);
    }
  };

  const signOut = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('user');
    toast.success('Signed out successfully');
  };

  // Check for stored user on initial load
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser) as User;
        setUser(parsedUser);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('user');
      }
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        userRole: user?.role || null,
        signIn,
        signOut,
      }}
    >
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
