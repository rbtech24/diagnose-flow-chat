
import { useState, useEffect } from "react";
import { Link, Navigate, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Wrench, Building, LayoutDashboard } from "lucide-react";
import { toast } from 'react-hot-toast';
import { supabase } from "@/integrations/supabase/client";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("tech"); // Default role: tech
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [connectionError, setConnectionError] = useState(false);
  const { login, isAuthenticated, userRole } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const from = location.state?.from || "/";
  
  useEffect(() => {
    if (location.state?.role && ['admin', 'company', 'tech'].includes(location.state.role)) {
      setRole(location.state.role);
    } 
    else {
      const roleParam = searchParams.get('role');
      if (roleParam && ['admin', 'company', 'tech'].includes(roleParam)) {
        setRole(roleParam);
      }
    }
    
    console.log("Login page loaded, redirect destination:", from, 
      "state:", location.state,
      "query params:", Object.fromEntries(searchParams.entries()),
      "selected role:", role);
      
    // Check if Supabase is connected
    const checkConnection = async () => {
      try {
        console.log("Checking Supabase connection...");
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Supabase connection error:", error);
          setConnectionError(true);
          toast.error("Connection to authentication service failed. Please try again later.");
        } else {
          console.log("Supabase connection successful, session data:", data);
          setConnectionError(false);
        }
      } catch (error) {
        console.error("Supabase connection check failed:", error);
        setConnectionError(true);
        toast.error("Connection to authentication service failed. Please check your internet connection.");
      }
    };
    
    checkConnection();
  }, [location, searchParams, from, role]);

  const updateRoleAndUrl = (newRole: string) => {
    setRole(newRole);
    
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set('role', newRole);
    navigate(`?${newSearchParams.toString()}`, { replace: true, state: { ...location.state, role: newRole } });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Email and password are required");
      return;
    }
    
    setIsLoggingIn(true);
    try {
      let emailToUse = email;
      if (!emailToUse.includes(role) && role !== "") {
        emailToUse = email.includes('@') 
          ? email.split('@')[0] + `-${role}@` + email.split('@')[1]
          : `${email}-${role}@example.com`;
      }
      
      console.log("Attempting sign in with email:", emailToUse);
      
      // Direct Supabase auth login instead of using context
      const { data, error } = await supabase.auth.signInWithPassword({
        email: emailToUse,
        password
      });
      
      if (error) {
        console.error("Sign in error:", error);
        if (error.message.includes("Network error") || error.message.includes("Failed to fetch")) {
          toast.error("Network error. Please check your connection and try again.");
          setConnectionError(true);
        } else if (error.message.includes("No API key")) {
          toast.error("Authentication configuration error. Please contact support.");
          console.error("Supabase API key error. Check your environment variables or Supabase client initialization.");
        } else {
          toast.error(error.message || "Failed to sign in");
        }
        return false;
      }
      
      if (data.user) {
        toast.success('Signed in successfully');
        console.log("Login successful, user:", data.user);
        
        // Update user role from Supabase metadata
        const userRole = data.user.user_metadata?.role || null;
        
        // Navigate to the appropriate dashboard based on user role
        if (from && from !== "/") {
          navigate(from, { replace: true });
        } else if (userRole) {
          navigate(`/${userRole}`, { replace: true });
        } else {
          navigate("/", { replace: true });
        }
        
        return true;
      }
      
      return false;
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error("Login failed. Please try again.");
      return false;
    } finally {
      setIsLoggingIn(false);
    }
  };

  if (isAuthenticated) {
    console.log("User authenticated with role:", userRole, "redirecting to:", from || `/${userRole}`);
    
    if (from && from !== "/") return <Navigate to={from} replace />;
    
    if (userRole === "admin") return <Navigate to="/admin" replace />;
    if (userRole === "company") return <Navigate to="/company" replace />;
    if (userRole === "tech") return <Navigate to="/tech" replace />;
    
    return <Navigate to="/" replace />;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-blue-50">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
        <div className="flex justify-center mb-6">
          <img
            src="/lovable-uploads/28cef98f-7973-4892-9eb5-f0e02978d22e.png"
            alt="Repair Auto Pilot Logo"
            className="h-20 w-auto object-contain"
            style={{ maxWidth: 240 }}
          />
        </div>
        
        <h1 className="text-center text-xl font-medium mb-2">
          Sign in to your account to continue
        </h1>
        
        <p className="text-center text-gray-600 mb-6">
          Start with a 30-day free trial, no credit card required
        </p>
        
        {connectionError && (
          <div className="bg-red-50 text-red-700 p-3 rounded border border-red-200 mb-4">
            <p className="text-sm font-medium">Connection to authentication server failed</p>
            <p className="text-xs mt-1">Please check your internet connection and try again. If the problem persists, please contact support.</p>
          </div>
        )}
        
        <div className="mb-6">
          <div className="text-sm font-medium mb-2">Select your role</div>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => updateRoleAndUrl("tech")}
              className={`flex items-center justify-center gap-2 p-3 rounded border ${
                role === "tech" 
                  ? "bg-blue-50 border-blue-500 text-blue-700" 
                  : "border-gray-200 hover:bg-gray-50"
              }`}
              aria-label="Select technician role"
            >
              <Wrench className="h-4 w-4" />
              <span>Technician</span>
            </button>
            
            <button
              type="button"
              onClick={() => updateRoleAndUrl("company")}
              className={`flex items-center justify-center gap-2 p-3 rounded border ${
                role === "company" 
                  ? "bg-blue-50 border-blue-500 text-blue-700" 
                  : "border-gray-200 hover:bg-gray-50"
              }`}
              aria-label="Select company role"
            >
              <Building className="h-4 w-4" />
              <span>Company</span>
            </button>
            
            <button
              type="button"
              onClick={() => updateRoleAndUrl("admin")}
              className={`flex items-center justify-center gap-2 p-3 rounded border ${
                role === "admin" 
                  ? "bg-blue-50 border-blue-500 text-blue-700" 
                  : "border-gray-200 hover:bg-gray-50"
              }`}
              aria-label="Select admin role"
            >
              <LayoutDashboard className="h-4 w-4" />
              <span>Admin</span>
            </button>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              className="bg-gray-50"
              required
              disabled={isLoggingIn}
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <Link
                to="/forgot-password"
                className="text-sm text-blue-600 hover:underline"
              >
                Forgot password?
              </Link>
            </div>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-gray-50"
              required
              disabled={isLoggingIn}
            />
          </div>
          
          <Button 
            type="submit" 
            className="w-full bg-blue-600 hover:bg-blue-700"
            disabled={isLoggingIn}
          >
            {isLoggingIn && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Sign in
          </Button>
        </form>
        
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{" "}
            <Link to="/signup" className="text-blue-600 hover:underline font-medium">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
