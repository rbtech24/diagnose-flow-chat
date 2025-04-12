
import { ReactNode, createContext, useContext, useState } from 'react';
import toast, { Toast, ToastPosition } from 'react-hot-toast';

export type ToastProps = {
  title?: string;
  description?: string;
  variant?: 'default' | 'destructive';
  action?: ReactNode;
};

type ToastContextType = {
  toast: ((props: ToastProps) => void) & {
    success: (message: string) => void;
    error: (message: string) => void;
    loading: (message: string) => void;
    custom: (jsx: ReactNode) => void;
    dismiss: (toastId?: string) => void;
  };
  dismiss: (toastId?: string) => void;
  toasts: any[]; // For compatibility with the shadcn/ui Toaster component
};

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<any[]>([]);

  // The main toast function that accepts our custom ToastProps
  const showToast = (props: ToastProps) => {
    const { title, description, variant } = props;
    
    // Create the content for the toast
    const content = (
      <div>
        {title && <div className="font-medium">{title}</div>}
        {description && <div className="text-sm">{description}</div>}
      </div>
    );
    
    if (variant === 'destructive') {
      return toast.error(content);
    }
    
    return toast.success(content);
  };

  // Add convenience methods
  showToast.success = toast.success;
  showToast.error = toast.error;
  showToast.loading = toast.loading;
  showToast.custom = toast.custom;
  showToast.dismiss = toast.dismiss;

  const contextValue = {
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
