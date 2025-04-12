
import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Wrench, Building, LayoutDashboard } from "lucide-react";
import { toast } from "react-hot-toast";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("tech"); // Default role: tech
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const { login, isAuthenticated, userRole } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    
    setIsLoggingIn(true);
    try {
      await login(email, password);
      toast.success("You have been successfully logged in.");
    } catch (error: any) {
      console.error("Login error:", error);
      toast.error(error.message || "Failed to sign in. Please check your credentials.");
    } finally {
      setIsLoggingIn(false);
    }
  };

  // Redirect if already authenticated
  if (isAuthenticated) {
    if (userRole === "admin") return <Navigate to="/admin" />;
    if (userRole === "company") return <Navigate to="/company" />;
    if (userRole === "tech") return <Navigate to="/tech" />;
    return <Navigate to="/" />;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-blue-50 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="flex justify-center mb-6">
            <img 
              src="/public/lovable-uploads/626e46ce-b31c-4656-8873-f950a140763f.png" 
              alt="Repair Autopilot" 
              className="h-16 w-auto" 
            />
          </div>
          
          <h1 className="text-center text-lg font-medium mb-6">
            Sign in to your account to continue
          </h1>
          
          <div className="mb-6">
            <div className="text-sm font-medium mb-2">Select your role</div>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setRole("tech")}
                className={`flex items-center justify-center gap-2 p-3 rounded border ${
                  role === "tech" 
                    ? "bg-blue-50 border-blue-500 text-blue-700" 
                    : "border-gray-200 hover:bg-gray-50"
                }`}
              >
                <Wrench className="h-4 w-4" />
                <span>Technician</span>
              </button>
              
              <button
                type="button"
                onClick={() => setRole("company")}
                className={`flex items-center justify-center gap-2 p-3 rounded border ${
                  role === "company" 
                    ? "bg-blue-50 border-blue-500 text-blue-700" 
                    : "border-gray-200 hover:bg-gray-50"
                }`}
              >
                <Building className="h-4 w-4" />
                <span>Company</span>
              </button>
              
              <button
                type="button"
                onClick={() => setRole("admin")}
                className={`flex items-center justify-center gap-2 p-3 rounded border ${
                  role === "admin" 
                    ? "bg-blue-50 border-blue-500 text-blue-700" 
                    : "border-gray-200 hover:bg-gray-50"
                }`}
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
                Sign up now
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
