
import { useState, useEffect } from "react";
import { Link, Navigate, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Wrench, Building, LayoutDashboard } from "lucide-react";
import { toast } from 'react-hot-toast';

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("tech"); // Default role: tech
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const { login, isAuthenticated, userRole } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const from = location.state?.from || "/";
  
  // Set initial role based on location state or query parameters
  useEffect(() => {
    // First check location state
    if (location.state?.role && ['admin', 'company', 'tech'].includes(location.state.role)) {
      setRole(location.state.role);
    } 
    // Then check URL query parameters
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
  }, [location, searchParams, from]);

  // Update URL when role is changed through UI
  const updateRoleAndUrl = (newRole: string) => {
    setRole(newRole);
    
    // Update URL query parameter without full navigation
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
      // Modify email if needed to match the role for demo purposes
      let emailToUse = email;
      if (!emailToUse.includes(role) && role !== "") {
        // For demo, append role to email if not already present
        emailToUse = email.includes('@') 
          ? email.split('@')[0] + `-${role}@` + email.split('@')[1]
          : `${email}-${role}@example.com`;
      }
      
      const success = await login(emailToUse, password);
      
      if (success) {
        // Let the automatic redirect in the useEffect handle navigation
        console.log("Login successful, will redirect to:", from);
      }
    } catch (error: any) {
      console.error("Login error:", error);
      // Error toast is shown in the AuthContext
    } finally {
      setIsLoggingIn(false);
    }
  };

  // Redirect if already authenticated
  if (isAuthenticated) {
    console.log("User authenticated with role:", userRole, "redirecting to:", from || `/${userRole}`);
    
    // Prioritize the saved "from" path if exists, otherwise redirect based on role
    if (from && from !== "/") return <Navigate to={from} replace />;
    
    // Ensure each role goes to their correct dashboard
    if (userRole === "admin") return <Navigate to="/admin" replace />;
    if (userRole === "company") return <Navigate to="/company" replace />;
    if (userRole === "tech") return <Navigate to="/tech" replace />;
    
    // Fallback to home
    return <Navigate to="/" replace />;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-blue-50">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
        <div className="flex justify-center mb-6">
          <img 
            src="/lovable-uploads/626e46ce-b31c-4656-8873-f950a140763f.png" 
            alt="Repair Autopilot" 
            className="h-16 w-auto" 
          />
        </div>
        
        <h1 className="text-center text-xl font-medium mb-2">
          Sign in to your account to continue
        </h1>
        
        <p className="text-center text-gray-600 mb-6">
          Start with a 30-day free trial, no credit card required
        </p>
        
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
