
import React from 'react';
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Loader2 } from "lucide-react";
import { AuthLayout } from "@/components/auth/AuthLayout";

export default function SignUp() {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [phoneNumber, setPhoneNumber] = React.useState("");
  const [role, setRole] = React.useState<'tech' | 'company'>('tech');
  const [isLoading, setIsLoading] = React.useState(false);
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const success = await signUp(email, password, role, {
        phoneNumber,
      });
      
      if (success) {
        navigate('/verify-email', { 
          state: { email }
        });
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
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label>I am a...</Label>
          <RadioGroup 
            defaultValue="tech" 
            onValueChange={(value) => setRole(value as 'tech' | 'company')} 
            className="grid grid-cols-2 gap-4"
          >
            <div>
              <RadioGroupItem value="tech" id="tech" className="peer sr-only" />
              <Label
                htmlFor="tech"
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-transparent p-4 hover:bg-muted peer-checked:border-primary [&:has([data-state=checked])]:border-primary"
              >
                <span className="text-sm font-medium">Technician</span>
              </Label>
            </div>
            <div>
              <RadioGroupItem value="company" id="company" className="peer sr-only" />
              <Label
                htmlFor="company"
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-transparent p-4 hover:bg-muted peer-checked:border-primary [&:has([data-state=checked])]:border-primary"
              >
                <span className="text-sm font-medium">Company</span>
              </Label>
            </div>
          </RadioGroup>
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
