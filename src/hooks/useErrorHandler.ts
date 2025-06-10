
import { useToast } from "@/components/ui/use-toast";

interface ErrorOptions {
  showToast?: boolean;
  title?: string;
}

export function useErrorHandler() {
  const { toast } = useToast();

  const handleError = (
    error: any, 
    context: string, 
    options: ErrorOptions = { showToast: true }
  ) => {
    console.error(`Error in ${context}:`, error);
    
    if (options.showToast) {
      // Enhanced error messages for security-related errors
      let errorMessage = error?.message || "Something went wrong. Please try again.";
      
      // Handle specific authentication errors
      if (error?.message?.includes('Invalid login credentials')) {
        errorMessage = "Invalid email or password. Please check your credentials and try again.";
      } else if (error?.message?.includes('Too many requests')) {
        errorMessage = "Too many attempts. Please wait before trying again.";
      } else if (error?.message?.includes('Email not confirmed')) {
        errorMessage = "Please check your email and click the confirmation link.";
      } else if (error?.message?.includes('Invalid token')) {
        errorMessage = "Your session has expired. Please log in again.";
      }
      
      toast({
        title: options.title || "An error occurred",
        description: errorMessage,
        variant: "destructive"
      });
    }
  };

  return { handleError };
}
