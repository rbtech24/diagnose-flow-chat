
import { ReactNode, createContext, useContext, useState } from 'react';
import toast, { Toast as HotToast } from 'react-hot-toast';

// Define types that match shadcn/ui toast types for compatibility
export type ToastProps = {
  title?: string;
  description?: string;
  variant?: 'default' | 'destructive';
  action?: ReactNode;
};

type ToastContextType = {
  toast: typeof toast;
  dismiss: (toastId?: string) => void;
  toasts: any[]; // For compatibility with the shadcn/ui Toaster component
};

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<any[]>([]);

  const contextValue: ToastContextType = {
    toast,
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

// Helper functions to adapt shadcn/ui toast props to react-hot-toast
export const shadcnToast = {
  // Converts shadcn toast props to react-hot-toast
  toast: (props: ToastProps | string) => {
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
  
  // For direct usage
  success: (message: string) => toast.success(message),
  error: (message: string) => toast.error(message),
  dismiss: toast.dismiss
};

// For direct usage without the hook
export { toast };
