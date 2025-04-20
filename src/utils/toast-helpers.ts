
import { toast as hotToast } from 'react-hot-toast';
import { toast as useToastHook } from '@/hooks/use-toast';

type ToastType = 'info' | 'success' | 'error' | 'loading';

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
