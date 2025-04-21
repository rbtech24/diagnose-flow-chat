
import { ToastProps, toast } from '@/hooks/use-toast';

export const adaptToast = {
  toast: (props: Partial<ToastProps> | string): void => {
    if (typeof props === 'string') {
      toast({ description: props });
      return;
    }
    
    toast(props);
  },
  
  success: (message: string): void => {
    toast({ description: message, type: "success" });
  },
  
  error: (message: string): void => {
    toast({ description: message, type: "error" });
  },
  
  dismiss: (id?: string): void => {
    if (id) {
      // Since our hooks/use-toast.tsx implementation wraps react-hot-toast,
      // we need to handle this special case
      const { toast: hotToast } = require("react-hot-toast");
      hotToast.dismiss(id);
    }
  }
};
