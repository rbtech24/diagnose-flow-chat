
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
      toast({
        title: options.title || "An error occurred",
        description: error?.message || "Something went wrong. Please try again.",
        variant: "destructive"
      });
    }
  };

  return { handleError };
}
