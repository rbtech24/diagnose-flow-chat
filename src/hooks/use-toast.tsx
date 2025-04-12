
import { ReactNode, createContext, useContext, useState } from 'react';
import toast from 'react-hot-toast';

export type ToastProps = {
  title?: string;
  description?: string;
  variant?: 'default' | 'destructive';
  action?: ReactNode;
};

type ToastContextType = {
  toast: (props: ToastProps) => void;
  dismiss: (toastId?: string) => void;
  toasts: any[]; // For compatibility with the shadcn/ui Toaster component
};

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<any[]>([]);

  const showToast = (props: ToastProps) => {
    const { title, description, variant } = props;
    
    if (variant === 'destructive') {
      return toast.error(
        <div>
          {title && <div className="font-medium">{title}</div>}
          {description && <div className="text-sm">{description}</div>}
        </div>
      );
    }
    
    return toast.success(
      <div>
        {title && <div className="font-medium">{title}</div>}
        {description && <div className="text-sm">{description}</div>}
      </div>
    );
  };

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
