
import { useState, useEffect } from 'react';

interface DemoUser {
  id: string;
  email: string;
  password: string;
  name: string;
  role: 'admin' | 'company' | 'tech';
  companyId?: string;
}

const demoUsers: DemoUser[] = [
  {
    id: 'admin-1',
    email: 'admin@repairautopilot.com',
    password: 'RepairAdmin123!',
    name: 'Super Admin',
    role: 'admin'
  },
  {
    id: 'company-1',
    email: 'company@repairautopilot.com',
    password: 'CompanyAdmin123!',
    name: 'Company Admin',
    role: 'company',
    companyId: 'company-1'
  },
  {
    id: 'tech-1',
    email: 'tech@repairautopilot.com',
    password: 'TechUser123!',
    name: 'Tech User',
    role: 'tech',
    companyId: 'company-1'
  }
];

export function useDemoAuth() {
  const [currentUser, setCurrentUser] = useState<DemoUser | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Check if user is already logged in
    const savedUser = localStorage.getItem('demoUser');
    if (savedUser) {
      try {
        setCurrentUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Error parsing saved user:', error);
        localStorage.removeItem('demoUser');
      }
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const user = demoUsers.find(u => 
        u.email.toLowerCase() === email.toLowerCase() && u.password === password
      );
      
      if (user) {
        setCurrentUser(user);
        localStorage.setItem('demoUser', JSON.stringify(user));
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    setCurrentUser(null);
    localStorage.removeItem('demoUser');
  };

  return {
    user: currentUser,
    isLoading,
    login,
    logout
  };
}
