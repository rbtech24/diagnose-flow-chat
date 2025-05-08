
import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/context/auth";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle, MailIcon } from "lucide-react";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { toast } from 'react-hot-toast';
import { supabase } from "@/integrations/supabase/client";

export default function VerifyEmail() {
  const navigate = useNavigate();
  const { resendVerificationEmail } = useAuth();
  const [email, setEmail] = useState<string>("");
  const [isSending, setIsSending] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [timer, setTimer] = useState(0);

  // Check if user is already verified and redirect appropriately
  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        if (data.session && data.session.user.email_confirmed_at) {
          // If user is verified, redirect to appropriate dashboard
          console.log("Active session found, redirecting");
          const role = data.session.user.user_metadata?.role;
          const redirectPath = role === 'admin' ? '/admin' :
                             role === 'company' ? '/company' : 
                             '/tech';
          navigate(redirectPath);
        } else {
          console.log("No active session found");
        }
      } catch (error) {
        console.error("Error checking session:", error);
      }
    };
    
    checkSession();
  }, [navigate]);

  // Get email from localStorage if available (stored during signup)
  useEffect(() => {
    const storedEmail = localStorage.getItem("verificationEmail");
    if (storedEmail) {
      setEmail(storedEmail);
    }
  }, []);

  // Cooldown timer for resend button
  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer(prevTimer => prevTimer - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  const handleResend = async () => {
    if (timer > 0) return;
    
    if (!email) {
      toast.error("Email address not found. Please return to signup.");
      return;
    }
    
    setIsSending(true);
    try {
      // Call resendVerificationEmail without email parameter to match the type definition
      const success = await resendVerificationEmail(email);
      if (success) {
        setIsSuccess(true);
        toast.success("Verification email sent!");
        // Start a 60-second cooldown
        setTimer(60);
        setTimeout(() => {
          setIsSuccess(false);
        }, 3000);
      } else {
        toast.error("Failed to send verification email. Please try again.");
      }
    } catch (error) {
      console.error("Error sending verification email:", error);
      toast.error("An unexpected error occurred.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <AuthLayout 
      title="Verify your email"
      description="Check your inbox for a verification link"
    >
      <div className="flex flex-col items-center py-6">
        <div className="h-16 w-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
          <MailIcon className="h-8 w-8 text-blue-600" />
        </div>
        
        <h2 className="text-xl font-medium mb-2">Check your inbox</h2>
        <p className="text-gray-600 text-center mb-6">
          We've sent a verification link to{" "}
          <span className="font-medium">{email || "your email address"}</span>
        </p>

        <p className="text-gray-600 text-sm text-center mb-6">
          Click the link in the email to verify your account and continue. 
          If you don't see the email, check your spam folder.
        </p>

        {isSuccess && (
          <div className="flex items-center gap-2 text-green-600 mb-4">
            <CheckCircle className="h-5 w-5" />
            <span>Email sent successfully!</span>
          </div>
        )}
        
        <Button 
          onClick={handleResend}
          variant="outline" 
          className="w-full"
          disabled={isSending || timer > 0}
        >
          {isSending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Sending...
            </>
          ) : timer > 0 ? (
            `Resend available in ${timer}s`
          ) : (
            "Resend verification email"
          )}
        </Button>

        <div className="mt-6 text-center text-sm">
          <span className="text-gray-600">
            Already verified?{" "}
          </span>
          <Link to="/login" className="text-blue-600 hover:underline font-medium">
            Sign in
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
}
