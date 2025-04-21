
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CheckCircle, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';
import { OnboardingFlow } from '@/components/auth/OnboardingFlow';

export default function VerifyEmailSuccess() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [countdown, setCountdown] = useState(5);
  
  useEffect(() => {
    // If user is not authenticated, redirect to login
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    // Check if the user has completed onboarding
    const hasCompletedOnboarding = user?.onboardingCompleted;
    
    if (hasCompletedOnboarding) {
      // Start countdown for auto-redirect
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            // Redirect based on user role
            if (user?.role === 'company') {
              navigate('/company');
            } else {
              navigate('/tech');
            }
          }
          return prev - 1;
        });
      }, 1000);
      
      return () => clearInterval(timer);
    } else {
      // Show automatic redirect message for 3 seconds before showing onboarding
      const timer = setTimeout(() => {
        setShowOnboarding(true);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, user, navigate]);
  
  // If showing onboarding, render the onboarding component
  if (showOnboarding) {
    return <OnboardingFlow />;
  }
  
  return (
    <div className="flex min-h-screen items-center justify-center bg-blue-50 p-6">
      <div className="w-full max-w-md">
        <Card className="shadow-lg">
          <CardHeader className="text-center pb-4">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
            <CardTitle className="text-2xl font-bold">Email Verified!</CardTitle>
            <CardDescription>
              Your email has been successfully verified.
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="bg-blue-50 rounded-lg p-4 text-center">
              {user?.onboardingCompleted ? (
                <p className="text-gray-700">
                  You will be redirected to your dashboard in {countdown} seconds.
                </p>
              ) : (
                <p className="text-gray-700">
                  We'll now guide you through a quick setup process to get started.
                </p>
              )}
            </div>
            
            {user?.onboardingCompleted && (
              <div className="flex justify-center">
                <Button asChild>
                  <Link to={user?.role === 'company' ? "/company" : "/tech"} className="gap-2">
                    Go to Dashboard 
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
