
import { ReactNode, createContext, useContext, useState } from 'react';
import toast from 'react-hot-toast';

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

  // Pass through the original toast function and its methods
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

// For direct usage without the hook
export { toast };
