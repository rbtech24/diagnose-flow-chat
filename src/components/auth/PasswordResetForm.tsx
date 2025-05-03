
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from 'react-hot-toast';
import { Alert, AlertDescription } from "@/components/ui/alert";

export function PasswordResetForm() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!email) {
      setError('Please enter your email address');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      
      if (error) {
        console.error('Password reset error:', error);
        setError(error.message);
        toast.error(error.message);
      } else {
        setIsSuccess(true);
        toast.success('Password reset instructions sent to your email');
      }
    } catch (err: any) {
      console.error('Password reset exception:', err);
      setError(err.message || 'An unexpected error occurred');
      toast.error(err.message || 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="text-center">
        <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
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
      {error && (
        <Alert variant="destructive">
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
          disabled={isLoading}
        />
      </div>
      
      <Button
        type="submit"
        className="w-full"
        disabled={isLoading}
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
