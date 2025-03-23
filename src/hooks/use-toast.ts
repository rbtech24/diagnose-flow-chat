
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

export function ToastProvider({ children }: { children: ReactNode }) {
  const toast = useToast();
  
  return (
    <ToastContext.Provider value={toast}>
      {children}
    </ToastContext.Provider>
  );
}

export function useToast() {
  // Use the existing react-hot-toast directly, don't try to use context/state here
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
}

export { toast };
