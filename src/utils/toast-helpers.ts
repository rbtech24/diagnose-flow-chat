
import { toast as hotToast } from 'react-hot-toast';
import { toast as useToastHook } from '@/hooks/use-toast';

// Match the type to what's expected in use-toast.tsx
type ToastType = 'info' | 'success' | 'error' | 'custom';

export const showToast = {
  message: (message: string) => hotToast(message),
  success: (message: string) => hotToast.success(message),
  error: (message: string) => hotToast.error(message),
  loading: (message: string) => hotToast.loading(message),
  custom: (title: string, description?: string, type: ToastType = 'info') => useToastHook({
    title,
    description,
    variant: type === 'error' ? 'destructive' : 'default',
    type
  })
};
