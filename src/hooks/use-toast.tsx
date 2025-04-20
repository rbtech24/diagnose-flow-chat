
import { toast as hotToast } from "react-hot-toast";

export interface ToastOptions {
  duration?: number;
  position?: "top-left" | "top-center" | "top-right" | "bottom-left" | "bottom-center" | "bottom-right";
}

export interface ToastProps {
  title?: string;
  description?: string;
  type?: "success" | "error" | "info" | "custom";
  variant?: "default" | "destructive";
  duration?: number;
  position?: "top-left" | "top-center" | "top-right" | "bottom-left" | "bottom-center" | "bottom-right";
}

// Create a toast function with success, error, and other methods attached
const createToast = (props: ToastProps | string) => {
  if (typeof props === 'string') {
    return hotToast(props);
  }
  
  const { title, description, type, variant, ...options } = props;
  const message = title 
    ? description 
      ? `${title}: ${description}` 
      : title
    : description || '';
  
  if (type === "error" || variant === "destructive") {
    return hotToast.error(message, options);
  } else if (type === "success") {
    return hotToast.success(message, options);
  }
  
  return hotToast(message, options);
};

// Add success and error methods to the toast function
createToast.success = (message: string, options?: ToastOptions) => {
  return hotToast.success(message, options);
};

createToast.error = (message: string, options?: ToastOptions) => {
  return hotToast.error(message, options);
};

// Export the enhanced toast function
export const toast = createToast;

export const useToast = () => {
  const showSuccess = (message: string, options?: ToastOptions) => {
    hotToast.success(message, options);
  };

  const showError = (message: string, options?: ToastOptions) => {
    hotToast.error(message, options);
  };

  const showInfo = (message: string, options?: ToastOptions) => {
    hotToast(message, options);
  };

  return {
    showSuccess,
    showError,
    showInfo,
    toast
  };
};

export default useToast;
