import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/context/AuthContext";
import { loginRateLimiter } from "@/utils/rateLimiter";
import { emailSchema, passwordSchema } from "@/components/security/InputValidator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Shield, AlertTriangle } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [remainingAttempts, setRemainingAttempts] = useState<number | null>(null);
  const [lockoutTime, setLockoutTime] = useState<number | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { login, user, isSessionValid, getSessionTimeRemaining } = useAuth();

  useEffect(() => {
    // If user is already logged in, redirect to the appropriate dashboard
    if (user) {
      navigate(`/${user.role}`);
    }
  }, [user, navigate]);

  // Session status indicator
  useEffect(() => {
    if (user && !isSessionValid()) {
      toast({
        title: "Session expired",
        description: "Please log in again",
        variant: "destructive",
      });
    }
  }, [user, isSessionValid, toast]);

  const validateForm = (): boolean => {
    let isValid = true;
    setEmailError("");
    setPasswordError("");

    // Validate email
    const emailResult = emailSchema.safeParse(email);
    if (!emailResult.success) {
      setEmailError(emailResult.error.errors[0]?.message || "Invalid email");
      isValid = false;
    }

    // Basic password validation for login (not as strict as signup)
    if (!password || password.length < 6) {
      setPasswordError("Password is required");
      isValid = false;
    }

    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    // Check rate limiting
    const rateLimitResult = loginRateLimiter.check(email);
    if (!rateLimitResult.allowed) {
      const resetTime = new Date(rateLimitResult.resetTime || Date.now());
      setLockoutTime(rateLimitResult.resetTime || 0);
      toast({
        title: "Too many login attempts",
        description: `Please try again after ${resetTime.toLocaleTimeString()}`,
        variant: "destructive",
      });
      return;
    }

    setRemainingAttempts(rateLimitResult.remainingAttempts || 0);
    setIsLoading(true);
    
    try {
      const success = await login(email, password);
      
      if (success) {
        // Reset rate limiter on successful login
        loginRateLimiter.reset(email);
        
        toast({
          title: "Login successful",
          description: `Welcome back! Redirecting to dashboard.`,
        });
        // Navigation will be handled by the useEffect above
      } else {
        // Update remaining attempts after failed login
        const updatedResult = loginRateLimiter.check(email);
        setRemainingAttempts(updatedResult.remainingAttempts || 0);
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

  const formatTimeRemaining = (ms: number): string => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
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
          <CardTitle className="text-2xl font-bold">Sign in</CardTitle>
          <CardDescription>
            Sign in to your account to continue
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Security Status Indicators */}
          {remainingAttempts !== null && remainingAttempts < 3 && (
            <Alert className="mb-4">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                {remainingAttempts > 0 
                  ? `${remainingAttempts} login attempts remaining`
                  : "Account temporarily locked"
                }
              </AlertDescription>
            </Alert>
          )}

          {lockoutTime && lockoutTime > Date.now() && (
            <Alert variant="destructive" className="mb-4">
              <Shield className="h-4 w-4" />
              <AlertDescription>
                Account locked. Try again in {formatTimeRemaining(lockoutTime - Date.now())}
              </AlertDescription>
            </Alert>
          )}

          {user && (
            <Alert className="mb-4">
              <Shield className="h-4 w-4" />
              <AlertDescription>
                Session expires in {formatTimeRemaining(getSessionTimeRemaining())}
              </AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={emailError ? "border-red-500" : ""}
                autoComplete="email"
                required
              />
              {emailError && <p className="text-sm text-red-500">{emailError}</p>}
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
                className={passwordError ? "border-red-500" : ""}
                autoComplete="current-password"
                required
              />
              {passwordError && <p className="text-sm text-red-500">{passwordError}</p>}
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-700" 
              disabled={isLoading || (lockoutTime !== null && lockoutTime > Date.now())}
            >
              {isLoading ? "Signing in..." : "Sign in"}
            </Button>
          </form>
        </CardContent>
        <CardFooter>
          <div className="text-center text-sm text-gray-500 w-full">
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
