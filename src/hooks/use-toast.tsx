
import { ReactNode, createContext, useContext, useState } from 'react';
import toast, { Toast } from 'react-hot-toast';

export type ToastProps = {
  title?: string;
  description?: string;
  variant?: 'default' | 'destructive';
  action?: ReactNode;
};

type ToastContextType = {
  toast: ((props: ToastProps | string) => void) & {
    success: (message: string) => void;
    error: (message: string) => void;
    loading: (message: string) => void;
    custom: typeof toast;
    dismiss: typeof toast.dismiss;
  };
  dismiss: (toastId?: string) => void;
  toasts: any[]; // For compatibility with the shadcn/ui Toaster component
};

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<any[]>([]);

  // Main toast function that handles both object and string inputs
  const showToast = ((props: ToastProps | string) => {
    if (typeof props === 'string') {
      // If a string is passed, use it as a simple message
      return toast(props);
    }
    
    const { title, description, variant } = props;
    
    // Create content based on title and description
    const content = (
      <div>
        {title && <div className="font-medium">{title}</div>}
        {description && <div className="text-sm">{description}</div>}
      </div>
    );
    
    // Use the appropriate toast variant
    if (variant === 'destructive') {
      return toast.error(content as any);
    }
    
    return toast(content as any);
  }) as ToastContextType['toast'];

  // Add direct access to toast methods
  showToast.success = toast.success;
  showToast.error = toast.error;
  showToast.loading = toast.loading;
  showToast.custom = toast;
  showToast.dismiss = toast.dismiss;

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
