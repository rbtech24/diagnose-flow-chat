
import { toast as hotToast } from 'react-hot-toast';

// Match the type to what's expected in use-toast.tsx
type ToastType = 'info' | 'success' | 'error' | 'custom';

// We're not using the hook version directly from this utility
// as hooks can only be called inside React components
export const showToast = {
  message: (message: string) => hotToast(message),
  success: (message: string) => hotToast.success(message),
  error: (message: string) => hotToast.error(message),
  loading: (message: string) => hotToast.loading(message),
  // Instead of calling the hook, we'll provide a version that doesn't use hooks
  custom: (title: string, description?: string, type: ToastType = 'info') => {
    // For react-hot-toast fallback
    if (type === 'error') {
      return hotToast.error(title + (description ? ` - ${description}` : ''));
    } else if (type === 'success') {
      return hotToast.success(title + (description ? ` - ${description}` : ''));
    } else {
      return hotToast(title + (description ? ` - ${description}` : ''));
    }
  }
};
