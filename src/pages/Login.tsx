
import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, AlertCircle } from "lucide-react";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { toast } from 'react-hot-toast';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { supabase } from "@/integrations/supabase/client";

export default function Login() {
  // Form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  // UI state
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formSubmitted, setFormSubmitted] = useState(false);
  
  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isEmailValid = emailRegex.test(email);
  
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn } = useAuth();

  const from = location.state?.from || "/";

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
    
    setIsLoading(true);
    
    try {
      console.log("Attempting login with email:", email);
      
      // Check if the Supabase client is properly initialized
      if (!supabase) {
        throw new Error("Authentication service is not available");
      }
      
      const success = await signIn(email, password);
      
      if (success) {
        toast.success("Signed in successfully!");
        console.log("Login successful, redirecting to home");
        navigate("/");
      } else {
        setError("Failed to sign in. Please check your credentials.");
        setIsLoading(false);
      }
    } catch (error: any) {
      // Handle API key error specifically
      if (error.message?.includes("API key")) {
        setError("Authentication service configuration error. Please contact support.");
        toast.error("Authentication service configuration error");
        setIsLoading(false);
        return;
      }
      
      // Check if this is an email verification error
      if (error.message?.includes("email") && error.message?.includes("verify")) {
        // Store email for verification page
        localStorage.setItem("verificationEmail", email);
        navigate('/verify-email');
        return;
      }

      const errorMessage = error.message || "An unexpected error occurred";
      setError(errorMessage);
      toast.error(errorMessage);
      console.error("Login exception:", error);
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout 
      title="Welcome back"
      description="Sign in to your account to continue"
      showSalesContent={false}
    >
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
            disabled={isLoading}
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
            disabled={isLoading}
            className={formSubmitted && password.trim() === "" ? "border-red-500" : ""}
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
