
import React, { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Mail, ArrowLeft, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { showToast } from '@/utils/toast-helpers';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function VerifyEmail() {
  const location = useLocation();
  const email = location.state?.email || '';
  const { resendVerificationEmail } = useAuth();
  const [isResending, setIsResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  
  const handleResendVerification = async () => {
    if (!email) {
      showToast.error("Email address not found. Please try signing up again.");
      return;
    }
    
    setIsResending(true);
    try {
      const success = await resendVerificationEmail(email);
      if (success) {
        setResendSuccess(true);
        showToast.success("Verification email has been resent");
      }
    } catch (error) {
      console.error("Error resending verification email:", error);
      showToast.error("Failed to resend verification email");
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-blue-50 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="flex justify-center mb-6">
            <img 
              src="/lovable-uploads/28cef98f-7973-4892-9eb5-f0e02978d22e.png" 
              alt="Repair Auto Pilot logo" 
              className="h-14 w-auto object-contain"
              style={{ maxWidth: 160 }}
            />
          </div>
          
          <div className="flex justify-center mb-6">
            <div className="bg-blue-100 rounded-full p-4">
              <Mail className="h-12 w-12 text-blue-600" />
            </div>
          </div>
          
          <h1 className="text-center text-2xl font-bold mb-4">
            Check your email
          </h1>
          
          <p className="text-center text-gray-600 mb-6">
            We sent a verification link to <span className="font-medium">{email}</span>. 
            Please check your email and click the link to verify your account.
          </p>
          
          {resendSuccess && (
            <Alert className="mb-6 bg-green-50 border-green-200">
              <AlertDescription className="text-green-700">
                We've sent you a new verification link. Please check your inbox.
              </AlertDescription>
            </Alert>
          )}
          
          <div className="space-y-4">
            <div className="flex flex-col items-center gap-6">
              <Button 
                variant="outline" 
                onClick={handleResendVerification}
                disabled={isResending}
                className="flex items-center gap-2"
              >
                {isResending ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <RefreshCw className="h-4 w-4" />
                    Resend verification email
                  </>
                )}
              </Button>
              
              <p className="text-sm text-gray-500 text-center">
                Didn't receive an email? Check your spam folder or try resending the verification link.
              </p>
            </div>
            
            <div className="flex justify-center mt-6">
              <Link to="/login" className="flex items-center text-blue-600 hover:text-blue-800">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to sign in
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
