
import { ToastProps } from '@/hooks/use-toast';
import toast from 'react-hot-toast';

// This adapter helps transition between shadcn/ui toast API and react-hot-toast API
export const adaptToast = {
  // Main toast function
  toast: (props: ToastProps | string) => {
    if (typeof props === 'string') {
      return toast(props);
    }
    
    const { title, description, variant } = props;
    const message = title 
      ? description 
        ? `${title}: ${description}` 
        : title
      : description || '';
    
    if (variant === 'destructive') {
      return toast.error(message);
    }
    
    return toast(message);
  },
  
  // Variant methods
  success: (message: string) => toast.success(message),
  error: (message: string) => toast.error(message),
  
  // Control methods
  dismiss: toast.dismiss
};
