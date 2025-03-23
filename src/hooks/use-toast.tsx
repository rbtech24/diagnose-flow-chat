
import { useState, useContext, createContext, ReactNode } from 'react';
import hotToast from 'react-hot-toast';
import type { Toast, ToastOptions as HotToastOptions } from 'react-hot-toast';

export type ToastProps = {
  title?: string;
  description?: string;
  variant?: 'default' | 'destructive';
  action?: ReactNode;
};

type ToastOptions = HotToastOptions;

type ToastFunction = {
  (props: ToastProps): void;
  success: (message: string) => void;
  error: (message: string) => void;
  dismiss: (toastId?: string) => void;
};

type ToastContextType = {
  toast: ToastFunction;
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

    return hotToast((t) => (
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

  // Create the toast function with attached methods
  const toastFn = (props: ToastProps) => showToast(props);
  toastFn.success = success;
  toastFn.error = error;
  toastFn.dismiss = hotToast.dismiss;

  return {
    toast: toastFn as ToastFunction,
    dismiss: hotToast.dismiss,
    // Empty array for compatibility with toaster component
    toasts: []
  };
};

export function ToastProvider({ children }: { children: ReactNode }) {
  // Initialize with a function that returns the handler, not the handler itself
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

// Export a singleton instance for direct usage
const toastHandler = createToastHandler();
export const toast = toastHandler.toast;
