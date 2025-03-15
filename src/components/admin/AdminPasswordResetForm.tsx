
import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { adminResetUserPassword } from "@/utils/auth";

const passwordResetSchema = z.object({
  newPassword: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords do not match.",
  path: ["confirmPassword"],
});

type AdminPasswordResetFormValues = z.infer<typeof passwordResetSchema>;

interface AdminPasswordResetFormProps {
  userId: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function AdminPasswordResetForm({ userId, onSuccess, onCancel }: AdminPasswordResetFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  const form = useForm<AdminPasswordResetFormValues>({
    resolver: zodResolver(passwordResetSchema),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });

  async function handleSubmit(values: AdminPasswordResetFormValues) {
    setIsSubmitting(true);
    
    try {
      const { error } = await adminResetUserPassword(userId, values.newPassword);
      
      if (error) {
        toast({
          title: "Error",
          description: error.message || "Failed to reset password.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Password reset successful",
          description: "The user's password has been reset.",
        });
        
        if (onSuccess) {
          onSuccess();
        }
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
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="newPassword"
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
        
        <div className="flex justify-end gap-2">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Resetting..." : "Reset Password"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
