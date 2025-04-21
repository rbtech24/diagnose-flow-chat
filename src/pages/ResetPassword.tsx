
import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, ChevronLeft } from "lucide-react";
import { toast } from "react-hot-toast";
import { supabase } from "@/integrations/supabase/client";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isResetting, setIsResetting] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  
  useEffect(() => {
    // Check if we have an access token in the URL fragment
    const params = new URLSearchParams(location.hash.substring(1));
    const accessToken = params.get("access_token");
    
    if (!accessToken) {
      console.log("No access token found in URL");
    }
  }, [location]);

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
    
    setIsResetting(true);
    try {
      // Update the user's password directly with Supabase
      const { error } = await supabase.auth.updateUser({ 
        password: password 
      });
      
      if (error) {
        console.error("Password reset error:", error);
        toast.error(error.message || "Failed to reset password. Please try again.");
        setPasswordError(error.message || "Failed to reset password");
      } else {
        toast.success("Your password has been reset successfully. You can now log in.");
        navigate("/login");
      }
    } catch (error: any) {
      console.error("Unexpected error during password reset:", error);
      toast.error(error.message || "An unexpected error occurred. Please try again.");
      setPasswordError("An unexpected error occurred");
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-blue-50 px-4 py-12">
      <Card className="w-full max-w-md shadow-lg border-0">
        <CardHeader className="space-y-1">
          <Link to="/login" className="flex items-center text-blue-600 hover:underline mb-4">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to login
          </Link>
          
          <div className="flex justify-center mb-4">
            <img 
              src="/lovable-uploads/5a6f684f-5f8a-4a11-b98b-107a464807d4.png" 
              alt="Repair Auto Pilot" 
              className="h-20 w-auto object-contain" 
              style={{ maxWidth: 240 }}
            />
          </div>
          
          <CardTitle className="text-2xl font-bold text-center">Reset password</CardTitle>
          <CardDescription className="text-center">
            Enter your new password below
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">New Password</Label>
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
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
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
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button 
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-700"
              disabled={isResetting}
            >
              {isResetting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Reset password
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
