
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Loader2 } from "lucide-react";
import { AuthLayout } from "@/components/auth/AuthLayout";

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<'tech' | 'company'>('tech');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      const success = await signUp(email, password, role);
      if (success) {
        navigate('/verify-email', { 
          state: { email }
        });
      }
    } catch (err: any) {
      setError(err.message || "An error occurred during sign up");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout 
      title="Create an account"
      description="Sign up for a 30-day free trial"
    >
      {error && (
        <div className="p-3 mb-4 text-sm bg-red-50 border border-red-100 text-red-600 rounded-md">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label>I am a...</Label>
          <RadioGroup defaultValue="tech" onValueChange={(value) => setRole(value as 'tech' | 'company')} className="grid grid-cols-2 gap-4">
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
