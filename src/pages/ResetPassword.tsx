
import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { updateUserPassword } from "@/utils/auth";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const resetPasswordSchema = z.object({
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match.",
  path: ["confirmPassword"],
});

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

export default function ResetPassword() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const [resetComplete, setResetComplete] = useState(false);
  
  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  async function handleSubmit(values: ResetPasswordFormValues) {
    setIsSubmitting(true);
    
    try {
      const { error } = await updateUserPassword(values.password);
      
      if (error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      } else {
        setResetComplete(true);
        toast({
          title: "Password updated",
          description: "Your password has been successfully updated.",
        });
        
        // Redirect to login after 3 seconds
        setTimeout(() => {
          navigate("/login");
        }, 3000);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-white p-4">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-6">
          <img 
            src="/lovable-uploads/868fa51f-a29b-4816-a866-c3f9cbdfac9e.png" 
            alt="Repair Auto Pilot" 
            className="h-32"
          />
        </div>
        
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Reset Your Password</CardTitle>
            <CardDescription>
              Please enter your new password below.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {resetComplete ? (
              <div className="text-center py-4">
                <h3 className="text-lg font-medium">Password Updated</h3>
                <p className="mt-2 text-sm text-gray-500">
                  Your password has been successfully reset. Redirecting to login...
                </p>
              </div>
            ) : (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>New Password</FormLabel>
                        <FormControl>
                          <Input type="password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm Password</FormLabel>
                        <FormControl>
                          <Input type="password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? "Updating..." : "Update Password"}
                  </Button>
                </form>
              </Form>
            )}
          </CardContent>
          <CardFooter className="justify-center">
            {!resetComplete && (
              <Button variant="link" onClick={() => navigate("/login")}>
                Back to Login
              </Button>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
