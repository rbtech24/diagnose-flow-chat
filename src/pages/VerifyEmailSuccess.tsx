
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function VerifyEmailSuccess() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect logic for verified users
    if (isAuthenticated) {
      // Redirect based on user role
      const redirectPath = user?.role === 'admin' ? '/admin' :
                           user?.role === 'company' ? '/company' : 
                           '/tech';
      
      // Automatic redirect after 3 seconds
      const timer = setTimeout(() => {
        navigate(redirectPath);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, user, navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-blue-50 p-6">
      <Card className="w-full max-w-md shadow-lg border-0">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          <CardTitle className="text-2xl font-bold">Email Verified!</CardTitle>
          <CardDescription>
            Your email has been successfully confirmed.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-gray-600 mb-4">
            You will be redirected to your dashboard in a few moments.
          </p>
          <Button onClick={() => navigate('/login')}>
            Back to Login
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
