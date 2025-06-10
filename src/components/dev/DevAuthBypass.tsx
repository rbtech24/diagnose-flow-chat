
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export function DevAuthBypass() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleDevLogin = async (email: string, role: string) => {
    try {
      // For development only - bypass actual authentication
      const success = await login(email, 'dev-password');
      
      if (success) {
        toast.success(`Logged in as ${role}`);
        navigate(`/${role}`);
      } else {
        toast.error('Failed to login');
      }
    } catch (error) {
      console.error('Dev login error:', error);
      toast.error('Development login failed');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Development Authentication Bypass</CardTitle>
        <CardDescription>
          Quick access to different user roles for testing
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button 
          onClick={() => handleDevLogin('admin@dev.com', 'admin')}
          className="w-full"
          variant="destructive"
        >
          Login as Admin
        </Button>
        
        <Button 
          onClick={() => handleDevLogin('company@dev.com', 'company')}
          className="w-full"
          variant="default"
        >
          Login as Company
        </Button>
        
        <Button 
          onClick={() => handleDevLogin('tech@dev.com', 'tech')}
          className="w-full"
          variant="outline"
        >
          Login as Technician
        </Button>
      </CardContent>
    </Card>
  );
}
