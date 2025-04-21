
import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, ChevronLeft } from "lucide-react";
import { toast } from "react-hot-toast";
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
              alt="Repair Auto Pilot" 
              className="h-20 w-auto object-contain" 
              style={{ maxWidth: 240 }}
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
