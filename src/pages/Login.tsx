
import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, AlertCircle } from "lucide-react";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { toast } from 'react-hot-toast';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { signInWithEmail, testAuthConnection } from "@/integrations/supabase/client";

export default function Login() {
  // Form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  // UI state
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'unknown' | 'connected' | 'error'>('unknown');
  
  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isEmailValid = emailRegex.test(email);
  
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn } = useAuth();

  const from = location.state?.from || "/";

  // Check connection status on component mount
  useEffect(() => {
    const checkConnection = async () => {
      const result = await testAuthConnection();
      setConnectionStatus(result.success ? 'connected' : 'error');
      
      if (!result.success) {
        setError("Authentication service connection issue. Please try again later.");
        toast.error("Authentication service connection issue");
      }
    };
    
    checkConnection();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
    setError(null);
    
    // Validate form before submission
    if (!isEmailValid) {
      setError("Please enter a valid email address");
      return;
    }
    
    if (password.trim() === "") {
      setError("Password is required");
      return;
    }
    
    if (connectionStatus === 'error') {
      setError("Authentication service is currently unavailable. Please try again later.");
      return;
    }
    
    setIsLoading(true);
    
    try {
      console.log("Attempting login with email:", email);
      
      // Use direct sign-in function with better error tracking
      const { data, error: signInError } = await signInWithEmail(email, password);
      
      if (signInError) {
        console.error("Login error details:", signInError);
        
        if (signInError.message?.includes("Invalid login credentials")) {
          throw new Error("Invalid email or password. Please try again.");
        } else if (signInError.message?.includes("Database error")) {
          throw new Error("Authentication service is currently experiencing issues. Please try again later.");
        } else if (signInError.message?.includes("rate limit")) {
          throw new Error("Too many login attempts. Please try again later.");
        } else {
          throw new Error(signInError.message || "Login failed. Please try again.");
        }
      }
      
      if (data) {
        toast.success("Signed in successfully!");
        console.log("Login successful, redirecting to", from);
        navigate(from);
        return;
      }
      
      // Use the AuthContext signIn as backup
      const success = await signIn(email, password);
      
      if (success) {
        toast.success("Signed in successfully!");
        console.log("Login successful, redirecting to", from);
        navigate(from);
      } else {
        setError("Invalid email or password. Please try again.");
      }
    } catch (error: any) {
      console.error("Login error:", error);

      // More specific error messages
      if (error.message?.includes("Invalid login")) {
        setError("Invalid email or password. Please try again.");
      } 
      else if (error.message?.includes("Email not confirmed")) {
        // Store email for verification page
        localStorage.setItem("verificationEmail", email);
        toast.error("Please verify your email before logging in");
        navigate('/verify-email');
        return;
      }
      else if (error.message?.includes("API key")) {
        setError("Authentication service configuration error. Please contact support.");
        toast.error("Authentication service configuration error");
      }
      else if (error.message?.includes("rate limit")) {
        setError("Too many attempts. Please try again later.");
        toast.error("Too many login attempts");
      }
      else if (error.message?.includes("Database error")) {
        setError("Authentication system is currently experiencing issues. Please try again later.");
        toast.error("Authentication system issues");
      }
      else {
        const errorMessage = error.message || "An unexpected error occurred";
        setError(errorMessage);
        toast.error(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout 
      title="Welcome back"
      description="Sign in to your account to continue"
      showSalesContent={false}
    >
      {connectionStatus === 'error' && (
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
    
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@example.com"
            required
            disabled={isLoading || connectionStatus === 'error'}
            className={formSubmitted && !isEmailValid ? "border-red-500" : ""}
          />
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <Link to="/forgot-password" className="text-sm text-blue-600 hover:underline">
              Forgot password?
            </Link>
          </div>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={isLoading || connectionStatus === 'error'}
            className={formSubmitted && password.trim() === "" ? "border-red-500" : ""}
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
              Signing in...
            </>
          ) : (
            "Sign in"
          )}
        </Button>
      </form>
      
      <div className="mt-6 text-center text-sm">
        <span className="text-gray-600">
          Don't have an account?{" "}
        </span>
        <Link to="/signup" className="text-blue-600 hover:underline font-medium">
          Sign up
        </Link>
      </div>
    </AuthLayout>
  );
}
