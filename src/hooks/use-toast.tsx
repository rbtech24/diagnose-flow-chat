
import React from "react";
import { toast as hotToast } from "react-hot-toast";

export type ToastType = "success" | "error" | "loading" | "custom" | "info";

export interface ToastProps {
  title?: string;
  description?: string;
  type?: ToastType;
  variant?: "default" | "destructive";
  duration?: number;
}

export function useToast() {
  const toast = (props: ToastProps | string) => {
    if (typeof props === 'string') {
      return hotToast(props);
    }

    const { title, description, type, duration = 3000 } = props;
    const message = title 
      ? description 
        ? `${title}: ${description}` 
        : title 
      : description || '';

    switch(type) {
      case 'success':
        return hotToast.success(message, { duration });
      case 'error':
        return hotToast.error(message, { duration });
      case 'loading':
        return hotToast.loading(message, { duration });
      default:
        return hotToast(message, { duration });
    }
  };

  return {
    toast,
    success: (message: string) => hotToast.success(message),
    error: (message: string) => hotToast.error(message),
    loading: (message: string) => hotToast.loading(message),
    dismiss: hotToast.dismiss
  };
}

// Direct toast export for simple usage without hooks
export const toast = {
  success: (message: string) => hotToast.success(message),
  error: (message: string) => hotToast.error(message),
  loading: (message: string) => hotToast.loading(message),
  dismiss: hotToast.dismiss
};
