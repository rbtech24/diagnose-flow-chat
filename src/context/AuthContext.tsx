
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@/types/user';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  isLoading: boolean;
  isSessionValid: () => boolean;
  getSessionTimeRemaining: () => number;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEMO_USERS = [
  {
    id: '11111111-1111-1111-1111-111111111111',
    email: 'admin@repairautopilot.com',
    password: 'RepairAdmin123!',
    name: 'Super Admin',
    role: 'admin' as const,
    companyId: '11111111-1111-1111-1111-111111111111'
  },
  {
    id: '22222222-2222-2222-2222-222222222222',
    email: 'company@repairautopilot.com',
    password: 'CompanyAdmin123!',
    name: 'Company Admin',
    role: 'company' as const,
    companyId: '22222222-2222-2222-2222-222222222222'
  },
  {
    id: '33333333-3333-3333-3333-333333333333',
    email: 'tech@repairautopilot.com',
    password: 'TechUser123!',
    name: 'Tech User',
    role: 'tech' as const,
    companyId: '22222222-2222-2222-2222-222222222222'
  }
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Check for existing session
    const savedUser = localStorage.getItem('demo_user');
    const sessionExpiry = localStorage.getItem('demo_session_expiry');
    
    if (savedUser && sessionExpiry) {
      const expiry = parseInt(sessionExpiry);
      if (Date.now() < expiry) {
        setUser(JSON.parse(savedUser));
      } else {
        localStorage.removeItem('demo_user');
        localStorage.removeItem('demo_session_expiry');
      }
    }
    
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    console.log('Attempting login for:', email);
    
    const demoUser = DEMO_USERS.find(u => u.email === email && u.password === password);
    
    if (demoUser) {
      const user: User = {
        id: demoUser.id,
        name: demoUser.name,
        email: demoUser.email,
        role: demoUser.role,
        companyId: demoUser.companyId
      };
      
      setUser(user);
      
      // Set session expiry to 8 hours from now
      const sessionExpiry = Date.now() + (8 * 60 * 60 * 1000);
      localStorage.setItem('demo_user', JSON.stringify(user));
      localStorage.setItem('demo_session_expiry', sessionExpiry.toString());
      
      console.log('Login successful, redirecting to:', `/${user.role}`);
      
      // Navigate to the appropriate dashboard
      setTimeout(() => {
        navigate(`/${user.role}`);
      }, 100);
      
      return true;
    } else {
      toast({
        title: "Login failed",
        description: "Invalid email or password",
        variant: "destructive",
      });
      return false;
    }
  };

  const logout = async (): Promise<void> => {
    setUser(null);
    localStorage.removeItem('demo_user');
    localStorage.removeItem('demo_session_expiry');
    navigate('/login');
  };

  const isSessionValid = (): boolean => {
    const sessionExpiry = localStorage.getItem('demo_session_expiry');
    if (!sessionExpiry) return false;
    return Date.now() < parseInt(sessionExpiry);
  };

  const getSessionTimeRemaining = (): number => {
    const sessionExpiry = localStorage.getItem('demo_session_expiry');
    if (!sessionExpiry) return 0;
    return Math.max(0, parseInt(sessionExpiry) - Date.now());
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      logout,
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
