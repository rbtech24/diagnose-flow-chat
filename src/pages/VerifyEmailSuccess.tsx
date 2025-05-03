
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';

export default function VerifyEmailSuccess() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    // Check if user is authenticated, otherwise get their session
    const checkUserSession = async () => {
      if (!isAuthenticated) {
        const { data } = await supabase.auth.getSession();
        if (!data.session) {
          // If no session, redirect to login
          navigate('/login');
          return;
        }
      }
    };
    
    checkUserSession();
    
    // Countdown for automatic redirect
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          // Redirect based on user role or to login if no user
          if (isAuthenticated || user) {
            const redirectPath = user?.role === 'admin' ? '/admin' :
                               user?.role === 'company' ? '/company' : 
                               '/tech';
            navigate(redirectPath);
          } else {
            navigate('/login');
          }
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
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
            You will be redirected to your dashboard in {countdown} seconds.
          </p>
          <Button onClick={() => navigate('/login')}>
            Go to Login
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
