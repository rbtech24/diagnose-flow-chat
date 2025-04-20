
import { toast as hotToast } from 'react-hot-toast';

// Match the type to what's expected in use-toast.tsx
type ToastType = 'info' | 'success' | 'error' | 'custom';

// We're not using the hook version directly from this utility
// as hooks can only be called inside React components
export const showToast = {
  message: (message: string) => hotToast(message),
  success: (message: string) => hotToast.success(message),
  error: (message: string) => hotToast.error(message),
  loading: (message: string) => hotToast.loading(message),
  // Instead of calling the hook, we'll provide a function that components can use
  custom: (title: string, description?: string, type: ToastType = 'info') => {
    // Return a function that can be called within a component
    return (toast: any) => {
      if (toast) {
        toast({
          title,
          description,
          variant: type === 'error' ? 'destructive' : 'default',
          type
        });
      } else {
        // Fallback to hot-toast if the hook isn't available
        type === 'error' 
          ? hotToast.error(title) 
          : type === 'success' 
            ? hotToast.success(title) 
            : hotToast(title);
      }
    };
  }
};
