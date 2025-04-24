
import React from 'react';
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { toast } from 'react-hot-toast';
import { signInWithEmail } from "@/integrations/supabase/client";

export default function Login() {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from || "/";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Use the direct signInWithEmail function to debug any issues
      const { data, error } = await signInWithEmail(email, password);
      
      if (error) {
        toast.error(error.message || "Failed to sign in");
        console.error("Login error:", error);
        setIsLoading(false);
        return;
      }
      
      if (data?.user) {
        toast.success("Signed in successfully!");
        console.log("Login successful, redirecting to:", from);
        navigate(from, { replace: true });
      } else {
        toast.error("Something went wrong. Please try again.");
        console.error("No user data returned on login");
        setIsLoading(false);
      }
    } catch (error: any) {
      toast.error(error.message || "An unexpected error occurred");
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
          />
        </div>
        
        <Button 
          type="submit" 
          className="w-full"
          disabled={isLoading}
        >
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Sign in
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
