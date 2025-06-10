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
import { Shield, AlertTriangle, CheckCircle, ArrowRight, Zap, Users, TrendingUp } from "lucide-react";

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid lg:grid-cols-2 min-h-screen gap-8 lg:gap-12">
          {/* Left Side - Welcome Back Content */}
          <div className="hidden lg:flex lg:items-center">
            <div className="w-full max-w-2xl mx-auto py-12">
              <div className="space-y-8">
                <div className="text-center">
                  <img 
                    src="/lovable-uploads/868fa51f-a29b-4816-a866-c3f9cbdfac9e.png" 
                    alt="Repair Auto Pilot" 
                    className="h-16 mx-auto mb-6"
                  />
                  <p className="text-lg text-gray-600 mb-8">
                    Continue streamlining your repair operations with powerful management tools
                  </p>
                </div>
                
                <div className="space-y-6">
                  <div className="flex items-center space-x-4 p-4 bg-blue-50 rounded-lg">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Zap className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Lightning Fast Diagnostics</h3>
                      <p className="text-gray-600 text-sm">Get back to completing jobs 40% faster</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4 p-4 bg-green-50 rounded-lg">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Users className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Team Collaboration</h3>
                      <p className="text-gray-600 text-sm">Manage your team and track progress in real-time</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4 p-4 bg-purple-50 rounded-lg">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <TrendingUp className="h-6 w-6 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Business Growth</h3>
                      <p className="text-gray-600 text-sm">Scale your operations with data-driven insights</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg p-6 text-white text-center">
                  <div className="flex items-center justify-center mb-2">
                    <CheckCircle className="h-5 w-5 mr-2" />
                    <span className="font-semibold">Trusted by 10,000+ professionals</span>
                  </div>
                  <p className="text-blue-100 text-sm">Join the repair revolution today</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Login Form */}
          <div className="flex items-center justify-center py-8 lg:py-12">
            <div className="w-full max-w-md mx-auto">
              {/* Welcome Back Title (no logo) */}
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                  Welcome Back
                </h1>
                <p className="text-gray-600 text-lg mt-2">
                  Sign in to continue your journey
                </p>
              </div>

              <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
                <CardHeader className="space-y-1 text-center pb-6">
                  <CardTitle className="text-2xl font-bold">Sign In</CardTitle>
                  <CardDescription>
                    Enter your credentials to access your account
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
                      {!isLoading && <ArrowRight className="ml-2 h-4 w-4" />}
                    </Button>
                  </form>
                </CardContent>
                <CardFooter>
                  <div className="text-center text-sm text-gray-500 w-full">
                    Don't have an account?{" "}
                    <Link to="/signup" className="text-blue-600 hover:text-blue-800 font-medium">
                      Sign up now
                    </Link>
                  </div>
                </CardFooter>
              </Card>

              {/* Mobile Benefits Content */}
              <div className="lg:hidden mt-8 bg-white/95 backdrop-blur-sm rounded-xl shadow-lg p-6">
                <div className="text-center mb-4">
                  <h3 className="font-bold text-gray-900 mb-2">Welcome Back!</h3>
                  <p className="text-sm text-gray-600">Continue your repair journey</p>
                </div>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center">
                    <Zap className="w-4 h-4 text-blue-600 mr-3" />
                    <span>Lightning fast diagnostics</span>
                  </div>
                  <div className="flex items-center">
                    <Users className="w-4 h-4 text-green-600 mr-3" />
                    <span>Team collaboration tools</span>
                  </div>
                  <div className="flex items-center">
                    <TrendingUp className="w-4 h-4 text-purple-600 mr-3" />
                    <span>Business growth analytics</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
