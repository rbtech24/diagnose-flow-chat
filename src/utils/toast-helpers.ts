
import { toast } from 'react-hot-toast';
import { toast as useToastHook } from '@/hooks/use-toast';

export const showToast = {
  message: (message: string) => toast(message),
  success: (message: string) => toast.success(message),
  error: (message: string) => toast.error(message),
  loading: (message: string) => toast.loading(message),
  custom: (title: string, description?: string) => useToastHook({
    title,
    description
  })
};
