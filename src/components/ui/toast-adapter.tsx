
import { ToastProps } from '@/hooks/use-toast';
import toast from 'react-hot-toast';

// This adapter helps transition between shadcn/ui toast API and react-hot-toast API
export const adaptToast = {
  // Main toast function that handles both string messages and shadcn/ui style objects
  toast: (props: Partial<ToastProps> | string): string => {
    if (typeof props === 'string') {
      return toast(props);
    }
    
    const { title, description, type, variant } = props;
    const message = title 
      ? description 
        ? `${title}: ${description}` 
        : title
      : description || '';
    
    // Check variant first, then type
    if (variant === "destructive" || type === "error") {
      return toast.error(message);
    } else if (type === "success") {
      return toast.success(message);
    }
    
    return toast(message);
  },
  
  // Variant methods
  success: (message: string): string => toast.success(message),
  error: (message: string): string => toast.error(message),
  
  // Control methods
  dismiss: toast.dismiss
};
