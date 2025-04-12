
import { ReactNode, createContext, useContext } from 'react';
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

type ToastContextType = {
  toast: (props: ToastProps | string) => string;
  success: (message: string) => string;
  error: (message: string) => string;
  dismiss: (toastId?: string) => void;
  toasts: Toast[];
};

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  // Simple functions that map to react-hot-toast
  const showToast = (props: ToastProps | string): string => {
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

  const showSuccess = (message: string): string => {
    return toast.success(message);
  };

  const showError = (message: string): string => {
    return toast.error(message);
  };

  const contextValue: ToastContextType = {
    toast: showToast,
    success: showSuccess,
    error: showError,
    dismiss: toast.dismiss,
    toasts: [] // Empty array as we're using react-hot-toast
  };

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  
  return context;
}

// For direct usage without the hook
export { toast };
