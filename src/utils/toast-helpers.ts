
import { toast } from "@/hooks/use-toast";

// For debugging purposes
console.log("Toast helpers loaded");

export const showToast = {
  success: (message: string) => {
    console.log("Success toast:", message);
    return toast({
      description: message,
      type: "success"
    });
  },
  error: (message: string) => {
    console.log("Error toast:", message);
    return toast({
      description: message,
      type: "error"
    });
  },
  info: (message: string) => {
    console.log("Info toast:", message);
    return toast({
      description: message,
      type: "info"
    });
  },
  warning: (message: string) => {
    console.log("Warning toast:", message);
    return toast({
      description: message,
      type: "info",
      variant: "destructive"
    });
  }
};
