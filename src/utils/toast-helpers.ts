
import { toast as hotToast } from 'react-hot-toast';
import { toast as useToastHook } from '@/hooks/use-toast';

export const showToast = {
  message: (message: string) => hotToast(message),
  success: (message: string) => hotToast.success(message),
  error: (message: string) => hotToast.error(message),
  loading: (message: string) => hotToast.loading(message),
  custom: (title: string, description?: string) => useToastHook({
    title,
    description,
    type: "info"
  })
};
