
import { Link } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PasswordResetForm } from "@/components/auth/PasswordResetForm";

export default function ForgotPassword() {
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
              src="/lovable-uploads/28cef98f-7973-4892-9eb5-f0e02978d22e.png" 
              alt="Repair Auto Pilot logo" 
              className="h-14 w-auto object-contain" 
              style={{ maxWidth: 160 }}
            />
          </div>
          
          <CardTitle className="text-2xl font-bold text-center">Forgot password</CardTitle>
          <CardDescription className="text-center">
            Enter your email address and we'll send you a link to reset your password
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <PasswordResetForm />
        </CardContent>
      </Card>
    </div>
  );
}
