
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { CheckCircle, Wrench, Building2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/context/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userRole, setUserRole] = useState<"tech" | "admin" | "company">("tech");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { login, user } = useAuth();

  useEffect(() => {
    // If user is already logged in, redirect to the appropriate dashboard
    if (user) {
      navigate(`/${user.role}`);
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: "Login failed",
        description: "Please enter both email and password.",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const success = await login(email, password, userRole);
      
      if (success) {
        toast({
          title: "Login successful",
          description: `Welcome back! Redirecting to ${userRole} dashboard.`,
        });
        navigate(`/${userRole}`);
      }
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "Login failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-white p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-3">
            <img 
              src="/lovable-uploads/868fa51f-a29b-4816-a866-c3f9cbdfac9e.png" 
              alt="Repair Auto Pilot" 
              className="h-32"
            />
          </div>
          <CardDescription>
            Sign in to your account to continue
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="role">Select your role</Label>
              <ToggleGroup type="single" variant="outline" value={userRole} onValueChange={(value) => value && setUserRole(value as "tech" | "admin" | "company")} className="justify-between">
                <ToggleGroupItem value="tech" className="flex-1 gap-1.5">
                  <Wrench className="h-4 w-4" />
                  Technician
                </ToggleGroupItem>
                <ToggleGroupItem value="company" className="flex-1 gap-1.5">
                  <Building2 className="h-4 w-4" />
                  Company
                </ToggleGroupItem>
                <ToggleGroupItem value="admin" className="flex-1 gap-1.5">
                  <CheckCircle className="h-4 w-4" />
                  Admin
                </ToggleGroupItem>
              </ToggleGroup>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="password">Password</Label>
                <Link to="/forgot-password" className="text-sm text-blue-600 hover:text-blue-800">
                  Forgot password?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            
            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={isLoading}>
              {isLoading ? "Signing in..." : "Sign in"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="text-center text-sm text-gray-500">
            Don't have an account?{" "}
            <Link to="/signup" className="text-blue-600 hover:text-blue-800">
              Sign up now
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
