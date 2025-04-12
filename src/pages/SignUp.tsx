
import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, ChevronLeft, Wrench, Building, CheckCircle2 } from "lucide-react";
import { toast } from "react-hot-toast";

export default function SignUp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [accountType, setAccountType] = useState("tech");
  const [passwordError, setPasswordError] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  
  const { register, isAuthenticated, userRole } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError("");
    
    if (password !== confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }
    
    if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      return;
    }
    
    setIsRegistering(true);
    try {
      await register({
        name,
        email,
        password,
        role: accountType,
        phone,
        companyName: undefined
      });
      
      toast.success("Your account has been created successfully!");
    } catch (error: any) {
      console.error("Registration error:", error);
      toast.error(error.message || "Failed to create account.");
    } finally {
      setIsRegistering(false);
    }
  };

  if (isAuthenticated) {
    if (userRole === "admin") return <Navigate to="/admin" />;
    if (userRole === "company") return <Navigate to="/company" />;
    if (userRole === "tech") return <Navigate to="/tech" />;
    return <Navigate to="/" />;
  }

  return (
    <div className="min-h-screen bg-blue-50 flex">
      {/* Left side - Info section */}
      <div className="w-1/2 p-10 flex flex-col">
        <Link to="/" className="flex items-center text-blue-600 hover:underline mb-8">
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to home
        </Link>
        
        <div className="flex justify-center mb-8">
          <img 
            src="/public/lovable-uploads/626e46ce-b31c-4656-8873-f950a140763f.png" 
            alt="Repair Autopilot" 
            className="h-16 w-auto" 
          />
        </div>
        
        <div className="mb-8">
          <h2 className="text-xl font-medium mb-2">
            Get immediate access to powerful diagnostic workflows for appliance repair professionals.
          </h2>
        </div>
        
        <div className="bg-white p-6 rounded-lg mb-8">
          <ul className="space-y-4">
            <li className="flex items-start">
              <CheckCircle2 className="h-5 w-5 text-blue-600 mr-2 mt-0.5" />
              <span>Start with a 14-day free trial</span>
            </li>
            <li className="flex items-start">
              <CheckCircle2 className="h-5 w-5 text-blue-600 mr-2 mt-0.5" />
              <span>Full access to all features</span>
            </li>
            <li className="flex items-start">
              <CheckCircle2 className="h-5 w-5 text-blue-600 mr-2 mt-0.5" />
              <span>No credit card required</span>
            </li>
            <li className="flex items-start">
              <CheckCircle2 className="h-5 w-5 text-blue-600 mr-2 mt-0.5" />
              <span>Choose a subscription plan later</span>
            </li>
          </ul>
        </div>
        
        <div className="space-y-6">
          <div className="flex items-start">
            <div className="bg-blue-100 rounded-full p-2 mr-4">
              <Wrench className="h-5 w-5 text-blue-700" />
            </div>
            <div>
              <h3 className="font-medium">Individual Technician</h3>
              <p className="text-sm text-gray-600">
                Access to diagnostic workflows, repair guides, and tracking tools.
              </p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="bg-blue-100 rounded-full p-2 mr-4">
              <Building className="h-5 w-5 text-blue-700" />
            </div>
            <div>
              <h3 className="font-medium">Affordable Plan</h3>
              <p className="text-sm text-gray-600">
                Low monthly fee with access to all features.
              </p>
            </div>
          </div>
        </div>
        
        <div className="mt-auto text-center">
          <p className="text-sm">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-600 hover:underline font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </div>
      
      {/* Right side - Signup form */}
      <div className="w-1/2 bg-white p-10">
        <div className="max-w-md mx-auto">
          <h1 className="text-2xl font-bold mb-2">Join Repair Auto Pilot</h1>
          
          <div className="mb-8">
            <h2 className="text-xl font-medium mb-1">Create Your Account</h2>
            <p className="text-sm text-gray-600">Choose your account type below</p>
            
            <div className="grid grid-cols-2 gap-4 mt-4">
              <button
                type="button"
                onClick={() => setAccountType("tech")}
                className={`flex items-center justify-center gap-2 p-3 rounded border ${
                  accountType === "tech" 
                    ? "bg-blue-50 border-blue-500 text-blue-700" 
                    : "border-gray-200 hover:bg-gray-50"
                }`}
              >
                <Wrench className="h-4 w-4" />
                <span>Technician</span>
              </button>
              
              <button
                type="button"
                onClick={() => setAccountType("company")}
                className={`flex items-center justify-center gap-2 p-3 rounded border ${
                  accountType === "company" 
                    ? "bg-blue-50 border-blue-500 text-blue-700" 
                    : "border-gray-200 hover:bg-gray-50"
                }`}
              >
                <Building className="h-4 w-4" />
                <span>Company</span>
              </button>
            </div>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                className="bg-gray-50"
                required
              />
            </div>
            
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
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="(555) 123-4567"
                className="bg-gray-50"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-gray-50"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="bg-gray-50"
                required
              />
              {passwordError && (
                <p className="text-sm text-red-500">{passwordError}</p>
              )}
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-700"
              disabled={isRegistering}
            >
              {isRegistering && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create {accountType === "tech" ? "Technician" : "Company"} Account
            </Button>
            
            <p className="text-xs text-gray-500 text-center mt-4">
              By signing up, you agree to our Terms of Service and Privacy Policy.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
