
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

// Export direct toast functions
const showToast = (props: ToastProps | string) => {
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
};

// Hook for using toast within components
export const useToast = () => {
  return {
    toast: showToast,
    success: (message: string) => toast.success(message),
    error: (message: string) => toast.error(message),
    dismiss: toast.dismiss,
    toasts: [] // Empty array as we're using react-hot-toast
  };
};

// For direct usage without the hook
export { toast };
