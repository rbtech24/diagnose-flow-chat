
import { ReactNode } from 'react';
import toast from 'react-hot-toast';

// Define types that match shadcn/ui toast types for compatibility
export type ToastProps = {
  title?: string;
  description?: string;
  variant?: 'default' | 'destructive';
  action?: ReactNode;
};

// This type is needed for shadcn/ui Toaster compatibility
export type Toast = {
  id: string;
  title?: string;
  description?: string;
  action?: ReactNode;
  variant?: 'default' | 'destructive';
};

// Simple functions that map to react-hot-toast
export const useToast = () => {
  return {
    toast: (props: ToastProps | string): string => {
      if (typeof props === 'string') {
        return toast(props);
      }

      const { title, description, variant } = props;
      const message = title 
        ? description 
          ? `${title}: ${description}` 
          : title
        : description || '';
      
      if (variant === 'destructive') {
        return toast.error(message);
      }
      
      return toast(message);
    },
    success: (message: string): string => {
      return toast.success(message);
    },
    error: (message: string): string => {
      return toast.error(message);
    },
    dismiss: toast.dismiss,
    toasts: [] // Empty array as we're using react-hot-toast
  };
};

// For direct usage without the hook
export { toast };
