
import { ReactNode, createContext, useContext, useState } from 'react';
import toast, { Toast } from 'react-hot-toast';

export type ToastProps = {
  title?: string;
  description?: string;
  variant?: 'default' | 'destructive';
  action?: ReactNode;
};

type ToastHandler = (message: string) => string;

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
  const showToast = ((props: ToastProps) => {
    const { title, description, variant } = props;
    
    // Create the content for the toast
    const content = (
      <div>
        {title && <div className="font-medium">{title}</div>}
        {description && <div className="text-sm">{description}</div>}
      </div>
    );
    
    if (variant === 'destructive') {
      return toast.error(content as any);
    }
    
    return toast(content as any);
  }) as unknown as ((props: ToastProps) => void) & {
    success: (message: string) => void;
    error: (message: string) => void;
    loading: (message: string) => void;
    custom: (jsx: ReactNode) => void;
    dismiss: (toastId?: string) => void;
  };

  // Add convenience methods
  showToast.success = toast.success;
  showToast.error = toast.error;
  showToast.loading = toast.loading;
  showToast.custom = (jsx: ReactNode) => toast(jsx as any);
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
