
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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { supabase } from "@/integrations/supabase/client";

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

  // Check for active session on component mount
  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        // If user is already logged in, redirect to appropriate dashboard
        const role = data.session.user.user_metadata.role;
        const redirectPath = role === 'admin' ? '/admin' :
                             role === 'company' ? '/company' : 
                             '/tech';
        navigate(redirectPath);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
    setError(null);
    
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
    
    setIsLoading(true);
    
    try {
      console.log("Starting signup with:", { email, role });
      
      // Check if the Supabase client is properly initialized
      if (!supabase) {
        throw new Error("Authentication service is not available");
      }
      
      const success = await signUp(email, password, role, { phoneNumber });
      
      if (success) {
        console.log("Signup successful");
        toast.success("Please check your email for verification");
        
        // Store email in localStorage before navigating
        localStorage.setItem("verificationEmail", email);
        
        navigate('/verify-email');
      } else {
        setError("Sign up failed. Please try again.");
      }
    } catch (err: any) {
      console.error("Unexpected error during signup:", err);
      
      // Handle specific errors
      if (err.message?.includes("API key")) {
        setError("Authentication service configuration error. Please contact support.");
        toast.error("Authentication service configuration error");
      } else {
        setError(err.message || "An unexpected error occurred");
        toast.error(err.message || "An unexpected error occurred");
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
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
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
            >
              Technician
            </Toggle>
            <Toggle
              pressed={role === 'company'}
              onPressedChange={() => setRole('company')}
              className="flex-1 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
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
            disabled={isLoading}
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
            disabled={isLoading}
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
            disabled={isLoading}
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
          disabled={isLoading}
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
    </AuthLayout>
  );
}
