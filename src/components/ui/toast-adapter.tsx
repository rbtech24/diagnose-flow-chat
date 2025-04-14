
import { ToastProps } from '@/hooks/use-toast';
import toast from 'react-hot-toast';

export const adaptToast = {
  toast: (props: Partial<ToastProps> | string): string => {
    if (typeof props === 'string') {
      return toast(props);
    }
    
    const { title, description, type, variant } = props;
    const message = title 
      ? description 
        ? `${title}: ${description}` 
        : title
      : description || '';
    
    if (type === "error" || variant === "destructive") {
      return toast.error(message);
    } else if (type === "success") {
      return toast.success(message);
    }
    
    return toast(message);
  },
  
  success: (message: string): string => toast.success(message),
  error: (message: string): string => toast.error(message),
  dismiss: toast.dismiss
};
