
import React from 'react';
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Toggle } from "@/components/ui/toggle";
import { Loader2 } from "lucide-react";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { supabase } from "@/integrations/supabase/client";
import { toast } from 'react-hot-toast';

export default function SignUp() {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [phoneNumber, setPhoneNumber] = React.useState("");
  const [role, setRole] = React.useState<'tech' | 'company'>('tech');
  const [isLoading, setIsLoading] = React.useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      console.log("Starting signup with:", { email, role });
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            role: role,
            phoneNumber,
          }
        }
      });
      
      if (error) {
        console.error("Signup error:", error);
        toast.error(error.message);
        setIsLoading(false);
        return;
      }
      
      console.log("Signup successful:", data);
      toast.success("Please check your email for verification");
      
      navigate('/verify-email', { 
        state: { email }
      });
    } catch (err: any) {
      console.error("Unexpected error during signup:", err);
      toast.error(err.message || "An unexpected error occurred");
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
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@example.com"
            required
            disabled={isLoading}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="phoneNumber">Phone Number</Label>
          <Input
            id="phoneNumber"
            type="tel"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="(123) 456-7890"
            disabled={isLoading}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={isLoading}
          />
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
