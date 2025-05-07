import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Toggle } from "@/components/ui/toggle";
import { Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { toast } from 'react-hot-toast';
import { useAuth } from "@/context/AuthContext";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { signUpWithEmail, testAuthConnection } from "@/integrations/supabase/client";

export default function SignUp() {
  // Form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [role, setRole] = useState<'tech' | 'company'>('tech');
  
  // UI state
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'unknown' | 'connected' | 'error'>('unknown');
  const [debugInfo, setDebugInfo] = useState<string | null>(null);
  const [maintenanceMode, setMaintenanceMode] = useState(false);

  // Password validation
  const [passwordFocus, setPasswordFocus] = useState(false);
  const passwordHasMinLength = password.length >= 8;
  const passwordHasNumber = /\d/.test(password);
  const passwordHasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  const isPasswordValid = passwordHasMinLength && passwordHasNumber && passwordHasSpecial;
  
  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isEmailValid = emailRegex.test(email);
  
  // Form validation
  const isFormValid = isEmailValid && isPasswordValid && (formSubmitted ? phoneNumber.trim() !== "" : true);
  
  const navigate = useNavigate();
  const { signUp } = useAuth();

  // Check connection status on component mount
  useEffect(() => {
    const checkConnection = async () => {
      try {
        console.log("Testing auth connection...");
        const result = await testAuthConnection();
        console.log("Auth connection test result:", result);
        
        setConnectionStatus(result.success ? 'connected' : 'error');
        
        if (!result.success) {
          setError("Authentication service connection issue. Please try again later.");
          toast.error("Authentication service connection issue");
          setDebugInfo(`Connection error: ${result.message}`);
        }
      } catch (err) {
        console.error("Error testing auth connection:", err);
        setConnectionStatus('error');
        setError("Failed to check authentication service. Please try again later.");
        setDebugInfo(`Connection test exception: ${err instanceof Error ? err.message : String(err)}`);
      }
    };
    
    checkConnection();

    // Check if we should enable maintenance mode based on repeated errors
    const authErrors = localStorage.getItem('sb-auth-errors');
    if (authErrors) {
      try {
        const errors = JSON.parse(authErrors);
        if (errors.length >= 3 && 
            errors.some(e => e.includes('Database error') || e.includes('column identities.provider_id does not exist'))) {
          setMaintenanceMode(true);
          setError("Our authentication system is undergoing maintenance. Please try again later or contact support.");
          setDebugInfo("Maintenance mode activated due to repeated database errors");
        }
      } catch (e) {
        console.error("Error parsing auth errors:", e);
      }
    }
  }, []);

  // Check for active session on component mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        const result = await testAuthConnection();
        if (result.success && result.session) {
          // If user is already logged in, redirect to appropriate dashboard
          console.log("Active session found, redirecting");
          const role = result.session.user.user_metadata?.role;
          const redirectPath = role === 'admin' ? '/admin' :
                              role === 'company' ? '/company' : 
                              '/tech';
          navigate(redirectPath);
        } else {
          console.log("No active session found");
        }
      } catch (error) {
        console.error("Error checking session:", error);
        setDebugInfo(`Session check error: ${error instanceof Error ? error.message : String(error)}`);
      }
    };
    
    checkSession();
  }, [navigate]);

  const formatPhoneNumber = (value: string) => {
    // Remove all non-digit characters
    const digits = value.replace(/\D/g, '');
    
    // Format as (XXX) XXX-XXXX
    if (digits.length <= 3) {
      return digits;
    } else if (digits.length <= 6) {
      return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
    } else {
      return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setPhoneNumber(formatted);
  };

  const logAuthError = (errorMessage: string) => {
    try {
      const existingErrors = localStorage.getItem('sb-auth-errors') || '[]';
      const errors = JSON.parse(existingErrors) as string[];
      errors.push(`${new Date().toISOString()}: ${errorMessage}`);
      
      // Keep only the last 10 errors
      if (errors.length > 10) {
        errors.shift();
      }
      
      localStorage.setItem('sb-auth-errors', JSON.stringify(errors));
    } catch (e) {
      console.error("Error logging auth error:", e);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
    setError(null);
    setDebugInfo(null);
    
    if (maintenanceMode) {
      setError("Our authentication system is currently undergoing maintenance. Please try again later or contact support.");
      return;
    }
    
    // Check form validity before submission
    if (!isEmailValid) {
      setError("Please enter a valid email address");
      return;
    }
    
    if (!isPasswordValid) {
      setError("Password doesn't meet the requirements");
      return;
    }
    
    if (phoneNumber.trim() === "") {
      setError("Phone number is required");
      return;
    }
    
    if (connectionStatus === 'error') {
      setError("Authentication service is currently unavailable. Please try again later.");
      return;
    }
    
    setIsLoading(true);
    
    try {
      console.log("Starting signup with:", { email, role });
      
      // Use the enhanced sign-up function
      const { data, error: signUpError } = await signUpWithEmail(
        email, 
        password, 
        {
          data: {
            role: role,
            name: email.split('@')[0],
            phoneNumber
          },
          redirectTo: `${window.location.origin}/verify-email-success`
        }
      );
      
      if (signUpError) {
        console.error("Sign up error details:", signUpError);
        
        // Log the auth error for tracking patterns
        logAuthError(signUpError.message || "Unknown signup error");
        
        if (signUpError.message?.includes("User already registered")) {
          throw new Error("This email is already registered. Please sign in instead.");
        } 
        else if (signUpError.message?.includes("Database error") || 
                signUpError.message?.includes("column") || 
                signUpError.status === 500) {
          setError("Our authentication system is currently experiencing issues. Please try again later or contact support.");
          setDebugInfo(`Database error: ${JSON.stringify(signUpError)}`);
          toast.error("Authentication system issues");
          
          // Check for repeated database errors
          const authErrors = localStorage.getItem('sb-auth-errors') || '[]';
          try {
            const errors = JSON.parse(authErrors) as string[];
            if (errors.filter(e => e.includes('Database error')).length >= 2) {
              setMaintenanceMode(true);
              setError("Our authentication system is undergoing maintenance. Please try again in a few hours or contact support.");
            }
          } catch (e) {
            console.error("Error parsing auth errors:", e);
          }
        } 
        else {
          setDebugInfo(`Signup error: ${JSON.stringify(signUpError)}`);
          throw new Error(signUpError.message || "Sign up failed. Please try again.");
        }
      }
      
      if (data) {
        console.log("Signup successful, response:", data);
        toast.success("Please check your email for verification");
        
        // Store email in localStorage before navigating
        localStorage.setItem("verificationEmail", email);
        
        navigate('/verify-email');
        return;
      }
      
      // Use the AuthContext signUp as backup
      const success = await signUp(email, password, role, { phoneNumber });
      
      if (success) {
        console.log("AuthContext signup successful");
        toast.success("Please check your email for verification");
        
        // Store email in localStorage before navigating
        localStorage.setItem("verificationEmail", email);
        
        navigate('/verify-email');
      } else {
        setError("Sign up failed. Please try again.");
        setDebugInfo("AuthContext signup returned false");
      }
    } catch (err: any) {
      console.error("Signup exception:", err);
      
      // Log the exception for tracking patterns
      logAuthError(err.message || "Unknown signup exception");
      
      // Handle specific API errors with more informative messages
      if (err.message?.includes("User already registered")) {
        setError("This email is already registered. Please sign in instead.");
        toast.error("Email already registered");
      } 
      else if (err.message?.includes("API key")) {
        setError("Authentication service configuration issue. Please contact support.");
        toast.error("Authentication service configuration issue");
      } 
      else if (err.message?.includes("rate limit")) {
        setError("Too many attempts. Please wait a moment and try again.");
        toast.error("Too many signup attempts");
      }
      else if (err.message?.includes("Database error") || 
              (typeof err === 'object' && err.status === 500)) {
        setError("Authentication system is currently experiencing issues. Please try again later.");
        setDebugInfo(`Database exception: ${err instanceof Error ? err.stack : JSON.stringify(err)}`);
        toast.error("Authentication system issues");
      }
      else {
        setError(err.message || "An unexpected error occurred");
        toast.error(err.message || "An unexpected error occurred");
        setDebugInfo(`Exception: ${err instanceof Error ? err.stack : JSON.stringify(err)}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout 
      title="Create an account"
      description="Sign up for a 30-day free trial"
      showSalesContent={true}
    >
      {maintenanceMode && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Maintenance Notice</AlertTitle>
          <AlertDescription>
            Our authentication system is currently undergoing maintenance. Please try again in a few hours or contact support.
          </AlertDescription>
        </Alert>
      )}

      {connectionStatus === 'error' && !maintenanceMode && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Authentication service is currently unavailable. Please try again later or contact support.
          </AlertDescription>
        </Alert>
      )}
    
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      {debugInfo && (
        <Alert className="mb-4 bg-yellow-50 border-yellow-400">
          <div className="text-xs text-yellow-800 font-mono whitespace-pre-wrap break-words">
            {debugInfo}
          </div>
        </Alert>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label>I am a...</Label>
          <div className="flex gap-4">
            <Toggle
              pressed={role === 'tech'}
              onPressedChange={() => setRole('tech')}
              className="flex-1 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
              disabled={isLoading || connectionStatus === 'error' || maintenanceMode}
            >
              Technician
            </Toggle>
            <Toggle
              pressed={role === 'company'}
              onPressedChange={() => setRole('company')}
              className="flex-1 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
              disabled={isLoading || connectionStatus === 'error' || maintenanceMode}
            >
              Company
            </Toggle>
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="email" className="flex justify-between">
            <span>Email</span>
            {email && (
              <span className={`text-xs ${isEmailValid ? 'text-green-500' : 'text-red-500'}`}>
                {isEmailValid ? 'Valid email' : 'Invalid email format'}
              </span>
            )}
          </Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@example.com"
            required
            disabled={isLoading || connectionStatus === 'error' || maintenanceMode}
            className={formSubmitted && !isEmailValid ? "border-red-500" : ""}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="phoneNumber">Phone Number</Label>
          <Input
            id="phoneNumber"
            type="tel"
            value={phoneNumber}
            onChange={handlePhoneChange}
            placeholder="(123) 456-7890"
            required
            disabled={isLoading || connectionStatus === 'error' || maintenanceMode}
            className={formSubmitted && phoneNumber.trim() === "" ? "border-red-500" : ""}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="password">
            Password
          </Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onFocus={() => setPasswordFocus(true)}
            onBlur={() => setPasswordFocus(passwordFocus && password !== "")}
            required
            disabled={isLoading || connectionStatus === 'error' || maintenanceMode}
            className={formSubmitted && !isPasswordValid ? "border-red-500" : ""}
          />
          
          {(passwordFocus || password.length > 0) && (
            <div className="text-xs space-y-1 mt-1 p-2 bg-gray-50 rounded border">
              <p className="font-medium mb-1">Password requirements:</p>
              <div className="flex items-center">
                <div className={passwordHasMinLength ? "text-green-500" : "text-gray-400"}>
                  {passwordHasMinLength ? <CheckCircle2 className="h-3.5 w-3.5 inline mr-1" /> : <AlertCircle className="h-3.5 w-3.5 inline mr-1" />}
                </div>
                <span className={passwordHasMinLength ? "text-green-700" : "text-gray-500"}>At least 8 characters</span>
              </div>
              <div className="flex items-center">
                <div className={passwordHasNumber ? "text-green-500" : "text-gray-400"}>
                  {passwordHasNumber ? <CheckCircle2 className="h-3.5 w-3.5 inline mr-1" /> : <AlertCircle className="h-3.5 w-3.5 inline mr-1" />}
                </div>
                <span className={passwordHasNumber ? "text-green-700" : "text-gray-500"}>At least one number</span>
              </div>
              <div className="flex items-center">
                <div className={passwordHasSpecial ? "text-green-500" : "text-gray-400"}>
                  {passwordHasSpecial ? <CheckCircle2 className="h-3.5 w-3.5 inline mr-1" /> : <AlertCircle className="h-3.5 w-3.5 inline mr-1" />}
                </div>
                <span className={passwordHasSpecial ? "text-green-700" : "text-gray-500"}>At least one special character</span>
              </div>
            </div>
          )}
        </div>
        
        <Button 
          type="submit" 
          className="w-full"
          disabled={isLoading || connectionStatus === 'error' || maintenanceMode}
        >
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Create account
        </Button>
      </form>
      
      <div className="mt-6 text-center text-sm">
        <span className="text-gray-600">
          Already have an account?{" "}
        </span>
        <Link to="/login" className="text-blue-600 hover:underline font-medium">
          Sign in
        </Link>
      </div>
      
      {/* Maintenance mode notice */}
      {maintenanceMode && (
        <Alert className="mt-4 bg-blue-50">
          <div className="text-sm text-blue-800">
            <p className="font-medium">Authentication System Maintenance</p>
            <p className="mt-1">
              Our team has been notified and is working on resolving the issue.
              You can check back later or contact support if you need immediate assistance.
            </p>
          </div>
        </Alert>
      )}
    </AuthLayout>
  );
}
