
import React, { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "react-hot-toast";
import { supabase, siteUrl } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";

const passwordResetSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
});

type PasswordResetFormValues = z.infer<typeof passwordResetSchema>;

export function PasswordResetForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  
  const form = useForm<PasswordResetFormValues>({
    resolver: zodResolver(passwordResetSchema),
    defaultValues: {
      email: "",
    },
  });

  async function handleSubmit(values: PasswordResetFormValues) {
    setIsSubmitting(true);
    
    try {
      console.log(`Sending password reset email to: ${values.email}`);
      console.log(`Using redirect URL: ${siteUrl}/reset-password`);
      
      // Add debugging that doesn't rely on protected properties
      console.log("Initiating password reset request with Supabase");
      console.log("Site URL for redirect:", siteUrl);
      
      const { error } = await supabase.auth.resetPasswordForEmail(values.email, {
        redirectTo: `${siteUrl}/reset-password`,
      });
      
      if (error) {
        toast.error(error.message);
        console.error("Password reset error:", error);
      } else {
        setEmailSent(true);
        toast.success("Check your email for a link to reset your password.");
      }
    } catch (error: any) {
      console.error("Unexpected error during password reset:", error);
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="w-full">
      {emailSent ? (
        <div className="text-center py-4">
          <h3 className="text-lg font-medium">Check your email</h3>
          <p className="mt-2 text-gray-500">
            We've sent a password reset link to your email address.
          </p>
        </div>
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input 
                      type="email" 
                      placeholder="your@email.com" 
                      autoComplete="email"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isSubmitting}
            >
              {isSubmitting ? "Sending..." : "Send Reset Link"}
            </Button>
          </form>
        </Form>
      )}
      
      <div className="mt-4 text-center">
        <Button variant="link" asChild>
          <Link to="/login">Back to Login</Link>
        </Button>
      </div>
    </div>
  );
}
