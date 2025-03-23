
import { useState, useContext, createContext, ReactNode } from 'react';
import toast from 'react-hot-toast';
import { Toast, ToastOptions as HotToastOptions } from 'react-hot-toast';

export type ToastProps = {
  title?: string;
  description?: string;
  variant?: 'default' | 'destructive';
  action?: ReactNode;
};

type ToastOptions = HotToastOptions;

type ToastContextType = {
  toast: (props: ToastProps) => void;
  toasts: any[]; // For compatibility with the toaster component
  dismiss: (toastId?: string) => void;
};

const ToastContext = createContext<ToastContextType | undefined>(undefined);

// Create a toast handler with both object syntax and direct methods
const createToastHandler = () => {
  // Main toast function that accepts our custom props format
  const showToast = ({ title, description, variant = 'default', action }: ToastProps) => {
    const toastOptions: ToastOptions = {
      duration: 4000,
      position: 'top-right',
    };

    if (variant === 'destructive') {
      toastOptions.className = 'bg-destructive text-destructive-foreground';
    }

    return toast((t) => (
      <div className="flex items-start">
        <div className="flex-1">
          {title && <div className="font-medium">{title}</div>}
          {description && <div className="text-sm opacity-90">{description}</div>}
        </div>
        {action && <div className="ml-2">{action}</div>}
      </div>
    ), toastOptions);
  };

  // Add convenience methods for success/error
  const success = (message: string) => {
    return showToast({ 
      title: "Success", 
      description: message 
    });
  };

  const error = (message: string) => {
    return showToast({ 
      title: "Error", 
      description: message, 
      variant: "destructive" 
    });
  };

  return {
    toast: Object.assign(showToast, { 
      success, 
      error,
      dismiss: toast.dismiss 
    }),
    dismiss: toast.dismiss,
    // Empty array for compatibility with toaster component
    toasts: []
  };
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [handler] = useState(createToastHandler);
  
  return (
    <ToastContext.Provider value={handler()}>
      {children}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  
  if (context === undefined) {
    // Fallback to direct implementation if used outside provider
    return createToastHandler();
  }
  
  return context;
}

// Export the toast directly so it can be used without the hook
export const { toast: toast2 } = createToastHandler();
