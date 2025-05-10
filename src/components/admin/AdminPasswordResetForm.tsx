
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/components/ui/use-toast";
import { useUserManagementStore } from "@/store/userManagementStore";

interface AdminPasswordResetFormProps {
  userId: string;
  userEmail: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function AdminPasswordResetForm({
  userId,
  userEmail,
  onSuccess,
  onCancel
}: AdminPasswordResetFormProps) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [notifyUser, setNotifyUser] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { resetUserPassword } = useUserManagementStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please make sure both passwords match.",
        variant: "destructive"
      });
      return;
    }
    
    if (password.length < 8) {
      toast({
        title: "Password too short",
        description: "Password must be at least 8 characters long.",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const success = await resetUserPassword(userId);
      
      if (success) {
        toast({
          title: "Password reset",
          description: notifyUser 
            ? `Password has been reset and an email has been sent to ${userEmail}.`
            : "Password has been reset successfully."
        });
        if (onSuccess) onSuccess();
      } else {
        toast({
          title: "Error",
          description: "Failed to reset password. Please try again.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Password reset error:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="password" className="block text-sm font-medium">
          New Password
        </label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter new password"
          required
          autoComplete="new-password"
        />
      </div>
      
      <div className="space-y-2">
        <label htmlFor="confirmPassword" className="block text-sm font-medium">
          Confirm Password
        </label>
        <Input
          id="confirmPassword"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Confirm password"
          required
          autoComplete="new-password"
        />
      </div>
      
      <div className="flex items-center space-x-2">
        <Checkbox 
          id="notifyUser" 
          checked={notifyUser} 
          onCheckedChange={(checked) => setNotifyUser(checked === true)}
        />
        <label
          htmlFor="notifyUser"
          className="text-sm font-medium leading-none cursor-pointer"
        >
          Send email notification to {userEmail}
        </label>
      </div>
      
      <div className="flex justify-end space-x-2">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Resetting..." : "Reset Password"}
        </Button>
      </div>
    </form>
  );
}
