
import { ReactNode, createContext, useContext, useState } from 'react';
import toast, { Toast } from 'react-hot-toast';

export type ToastProps = {
  title?: string;
  description?: string;
  variant?: 'default' | 'destructive';
  action?: ReactNode;
};

type ToastContextType = {
  toast: (props: ToastProps | string) => void;
  dismiss: (toastId?: string) => void;
  toasts: any[]; // For compatibility with the shadcn/ui Toaster component
};

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<any[]>([]);

  // Main toast function that handles both object and string inputs
  const showToast = (props: ToastProps | string) => {
    if (typeof props === 'string') {
      // If a string is passed, use it as a simple message
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
  };

  const contextValue: ToastContextType = {
    toast: showToast,
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
