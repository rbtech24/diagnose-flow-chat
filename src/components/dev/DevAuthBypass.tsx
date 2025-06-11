
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Key, LogIn, UserCheck, CheckCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface DemoUser {
  email: string;
  password: string;
  role: string;
  name: string;
}

export function DevAuthBypass() {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const [isLoggingIn, setIsLoggingIn] = useState<string | null>(null);

  // Demo users with credentials
  const demoUsers: DemoUser[] = [
    { 
      email: 'admin@repairautopilot.com',
      password: 'RepairAuto2024!',
      role: 'Admin',
      name: 'System Admin'
    },
    { 
      email: 'company@repairautopilot.com',
      password: 'RepairAuto2024!',
      role: 'Company Admin',
      name: 'Company Manager'
    },
    { 
      email: 'tech@repairautopilot.com',
      password: 'RepairAuto2024!',
      role: 'Tech',
      name: 'Demo Technician'
    }
  ];

  // Redirect if user is already logged in
  useEffect(() => {
    if (user) {
      const redirectPath = `/${user.role.toLowerCase()}`;
      navigate(redirectPath);
    }
  }, [user, navigate]);

  const handleDemoLogin = async (demoUser: DemoUser) => {
    try {
      setIsLoggingIn(demoUser.email);
      
      const success = await login(demoUser.email, demoUser.password);
      
      if (success) {
        const role = demoUser.role.toLowerCase().replace(' ', '_');
        toast.success(`Logged in as ${demoUser.name}`);
        navigate(`/${role}`);
      } else {
        toast.error('Demo login failed. Please try again.');
        setIsLoggingIn(null);
      }
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error('Demo login error. Please try again.');
      setIsLoggingIn(null);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto bg-white/95 backdrop-blur-sm shadow-lg border-0">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold">Demo Login</CardTitle>
        <CardDescription>
          Choose a demo account to log in with pre-configured credentials
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert className="bg-blue-50 text-blue-800 border-blue-200">
          <CheckCircle className="h-4 w-4" />
          <AlertTitle>Demo Mode Active</AlertTitle>
          <AlertDescription className="text-sm">
            Demo accounts work independently of database configuration. Perfect for testing and development.
          </AlertDescription>
        </Alert>

        <Alert className="bg-amber-50 text-amber-800 border-amber-200">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Development Environment</AlertTitle>
          <AlertDescription className="text-sm">
            These are demo logins for development and testing. Use the standard login page for production.
          </AlertDescription>
        </Alert>

        <div className="space-y-3">
          {demoUsers.map((demoUser) => (
            <Button
              key={demoUser.email}
              variant="outline"
              className="w-full justify-between py-6 px-4 border hover:bg-blue-50 hover:border-blue-200 transition-colors"
              onClick={() => handleDemoLogin(demoUser)}
              disabled={!!isLoggingIn}
            >
              <div className="flex items-center space-x-3">
                <UserCheck className="h-5 w-5 text-blue-600" />
                <div className="text-left">
                  <div className="font-semibold">{demoUser.role}</div>
                  <div className="text-xs text-gray-500">{demoUser.email}</div>
                </div>
              </div>
              {isLoggingIn === demoUser.email ? (
                <div className="animate-spin w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full"></div>
              ) : (
                <LogIn className="h-4 w-4" />
              )}
            </Button>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex flex-col space-y-2 pt-2">
        <div className="w-full text-center text-xs text-gray-500 border-t pt-4">
          <div className="flex items-center justify-center gap-1 mb-1">
            <Key className="h-3 w-3" />
            <span>Password for all accounts:</span>
          </div>
          <code className="px-2 py-1 bg-gray-100 rounded text-xs font-mono">RepairAuto2024!</code>
        </div>
      </CardFooter>
    </Card>
  );
}
