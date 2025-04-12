
import { ReactNode, createContext, useContext } from 'react';
import toast, { Toast as HotToast } from 'react-hot-toast';
import { adaptToast } from '@/components/ui/toast-adapter';

// Define types that match shadcn/ui toast types for compatibility
export type ToastProps = {
  title?: string;
  description?: string;
  variant?: 'default' | 'destructive';
  action?: ReactNode;
};

// This type is needed for shadcn/ui Toaster compatibility
export type Toast = {
  id: string;
  title?: string;
  description?: string;
  action?: ReactNode;
  variant?: 'default' | 'destructive';
};

type ToastContextType = {
  toast: (props: ToastProps | string) => void;
  success: (message: string) => void;
  error: (message: string) => void;
  dismiss: (toastId?: string) => void;
  toasts: Toast[]; // Add this for shadcn/ui Toaster compatibility
};

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  // Use the adapter to provide shadcn/ui style toast API
  const contextValue: ToastContextType = {
    toast: adaptToast.toast,
    success: adaptToast.success,
    error: adaptToast.error,
    dismiss: adaptToast.dismiss,
    toasts: [] // Empty array as we're using react-hot-toast for actual rendering
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
