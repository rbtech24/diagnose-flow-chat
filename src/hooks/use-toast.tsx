
import { useState, useContext, createContext, ReactNode } from 'react';
import toast, { Toast, ToastOptions as HotToastOptions } from 'react-hot-toast';

type ToastProps = {
  title?: string;
  description?: string;
  variant?: 'default' | 'destructive';
  action?: ReactNode;
};

type ToastOptions = HotToastOptions;

type ToastContextType = {
  toast: (props: ToastProps) => void;
  dismiss: (toastId?: string) => void;
};

const ToastContext = createContext<ToastContextType | undefined>(undefined);

// Extract the showToast functionality to avoid circular dependency
const createToastHandler = () => {
  const showToast = ({ title, description, variant = 'default', action }: ToastProps) => {
    const toastOptions: ToastOptions = {
      duration: 4000,
      position: 'top-right',
    };

    if (variant === 'destructive') {
      toastOptions.style = {
        border: '1px solid #f43f5e',
        padding: '16px',
        color: '#f43f5e',
      };
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

  return {
    toast: showToast,
    dismiss: toast.dismiss,
  };
};

export function ToastProvider({ children }: { children: ReactNode }) {
  // Use the handler directly instead of calling useToast() to avoid circular dependency
  const toastHandler = createToastHandler();
  
  return (
    <ToastContext.Provider value={toastHandler}>
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

export { toast };
