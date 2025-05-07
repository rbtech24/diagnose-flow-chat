
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, AlertCircle, CheckCircle } from "lucide-react";
import { resetPassword, testAuthConnection } from "@/integrations/supabase/client";
import { toast } from 'react-hot-toast';
import { Alert, AlertDescription } from "@/components/ui/alert";

export function PasswordResetForm() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<'unknown' | 'connected' | 'error'>('unknown');
  
  const navigate = useNavigate();

  // Check connection status on component mount
  useEffect(() => {
    const checkConnection = async () => {
      const result = await testAuthConnection();
      setConnectionStatus(result.success ? 'connected' : 'error');
      
      if (!result.success) {
        setError("Authentication service connection issue. Please try again later.");
      }
    };
    
    checkConnection();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!email) {
      setError('Please enter your email address');
      return;
    }
    
    if (connectionStatus === 'error') {
      setError("Authentication service is currently unavailable. Please try again later.");
      return;
    }
    
    setIsLoading(true);
    
    try {
      const { error: resetError } = await resetPassword(email);
      
      if (resetError) {
        if (resetError.message.includes("rate limit")) {
          setError("Too many attempts. Please try again later.");
          toast.error("Too many password reset attempts");
        } else {
          setError(resetError.message);
          toast.error(resetError.message);
        }
      } else {
        setIsSuccess(true);
        toast.success('Password reset instructions sent to your email');
      }
    } catch (err: any) {
      console.error('Password reset exception:', err);
      
      // Handle API configuration errors
      if (err.message?.includes("API key")) {
        setError("Authentication service configuration issue. Please contact support.");
        toast.error("Authentication service configuration issue");
      } else {
        setError(err.message || 'An unexpected error occurred');
        toast.error(err.message || 'An unexpected error occurred');
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="text-center">
        <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="h-8 w-8 text-green-600" />
        </div>
        
        <h2 className="text-xl font-semibold mb-2">Check your email</h2>
        <p className="text-gray-600 mb-6">
          We've sent password reset instructions to <span className="font-medium">{email}</span>
        </p>
        
        <p className="text-sm text-gray-500">
          If you don't see the email in your inbox, check your spam folder.
        </p>
        
        <div className="mt-8">
          <Button 
            onClick={() => navigate('/login')}
            variant="outline"
            className="w-full"
          >
            Back to login
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {connectionStatus === 'error' && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4 mr-2" />
          <AlertDescription>
            Authentication service is currently unavailable. Please try again later or contact support.
          </AlertDescription>
        </Alert>
      )}
    
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4 mr-2" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <div>
        <Label htmlFor="email" className="block mb-1">Email address</Label>
        <Input
          id="email"
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={isLoading || connectionStatus === 'error'}
        />
      </div>
      
      <Button
        type="submit"
        className="w-full"
        disabled={isLoading || connectionStatus === 'error'}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Sending reset link...
          </>
        ) : "Send reset instructions"}
      </Button>
      
      <div className="text-center mt-4">
        <Button 
          variant="link" 
          className="text-sm text-blue-600"
          onClick={() => navigate('/login')}
        >
          Back to login
        </Button>
      </div>
    </form>
  );
}
