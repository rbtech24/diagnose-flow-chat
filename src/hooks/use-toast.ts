
// This custom hook for displaying toast notifications works with react-hot-toast
import toast from 'react-hot-toast';

export type ToastProps = {
  title?: string;
  description?: string;
  variant?: 'default' | 'destructive';
  action?: React.ReactNode;
};

type ToastContextType = {
  toast: (props: ToastProps) => void;
  dismiss: (toastId?: string) => void;
  toasts: any[]; // For compatibility with the shadcn/ui Toaster component
};

export function useToast(): ToastContextType {
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

  return {
    toast: showToast,
    dismiss: toast.dismiss,
    toasts: []
  };
}

// For direct usage without the hook
export { toast };

// Re-export ToastProvider as a React component to maintain compatibility
export function ToastProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
