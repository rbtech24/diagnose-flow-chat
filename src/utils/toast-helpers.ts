
import { toast } from '@/hooks/use-toast';

// This helper simplifies standardized access to toast methods across the application
export const showToast = {
  // Basic toast with message only
  message: (message: string): string => toast.custom(message),
  
  // Success variant
  success: (message: string): string => toast.success(message),
  
  // Error variant
  error: (message: string): string => toast.error(message),
  
  // For shadcn/ui compatibility - use this when you have title/description pattern
  titleDescription: (title: string, description?: string): string => {
    return toast.custom(description ? `${title}: ${description}` : title);
  },
  
  // For shadcn/ui compatibility with variants
  titleDescriptionVariant: (title: string, description?: string, variant?: 'default' | 'destructive'): string => {
    const message = description ? `${title}: ${description}` : title;
    return variant === 'destructive' ? toast.error(message) : toast.custom(message);
  },

  // Dismiss method
  dismiss: toast.dismiss
};
