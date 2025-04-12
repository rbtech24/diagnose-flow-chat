
import { ReactNode, createContext, useContext, useState } from 'react';
import toast, { Toast as HotToast } from 'react-hot-toast';

export type ToastProps = {
  title?: string;
  description?: string;
  variant?: 'default' | 'destructive';
  action?: ReactNode;
};

type ToastContextType = {
  toast: ((props: ToastProps | string) => string) & typeof toast;
  dismiss: (toastId?: string) => void;
  toasts: any[]; // For compatibility with the shadcn/ui Toaster component
};

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<any[]>([]);

  // Create a custom toast function that handles both object and string inputs
  const customToast = ((props: ToastProps | string) => {
    if (typeof props === 'string') {
      return toast(props);
    }
    
    const { title, description, variant } = props;
    
    // Create combined message
    const message = title 
      ? description 
        ? `${title}: ${description}` 
        : title
      : description || '';
    
    // Use the appropriate toast variant
    if (variant === 'destructive') {
      return toast.error(message);
    }
    
    return toast(message);
  }) as ((props: ToastProps | string) => string) & typeof toast;

  // Add all the methods from the original toast
  customToast.success = toast.success;
  customToast.error = toast.error;
  customToast.loading = toast.loading;
  customToast.custom = toast.custom;
  customToast.dismiss = toast.dismiss;
  customToast.remove = toast.remove;
  customToast.promise = toast.promise;

  const contextValue: ToastContextType = {
    toast: customToast,
    dismiss: toast.dismiss,
    toasts
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
