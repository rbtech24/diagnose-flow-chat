
import toast from 'react-hot-toast';

// This helper simplifies standardized access to toast methods across the application
export const showToast = {
  // Basic toast with message only
  message: (message: string) => toast(message),
  
  // Success variant
  success: (message: string) => toast.success(message),
  
  // Error variant
  error: (message: string) => toast.error(message),
  
  // For shadcn/ui compatibility - use this when you have title/description pattern
  titleDescription: (title: string, description?: string) => {
    const message = description ? `${title}: ${description}` : title;
    return toast(message);
  },
  
  // For shadcn/ui compatibility with variants
  titleDescriptionVariant: (title: string, description?: string, variant?: 'default' | 'destructive') => {
    const message = description ? `${title}: ${description}` : title;
    return variant === 'destructive' ? toast.error(message) : toast(message);
  },

  // Dismiss method
  dismiss: toast.dismiss
};
