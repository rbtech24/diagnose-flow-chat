
import React from "react";
import { toast as hotToast, type Toast as HotToast } from "react-hot-toast";

export type ToastType = "success" | "error" | "loading" | "custom";

export interface ToastProps {
  id?: string;
  title?: string;
  description?: string;
  type: ToastType;
  duration?: number;
  position?: "top-left" | "top-center" | "top-right" | "bottom-left" | "bottom-center" | "bottom-right";
  icon?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onDismiss?: () => void;
}

export type Toast = ToastProps;

export function useToast() {
  const toast = (props: ToastProps) => {
    const { title, description, type, duration = 5000, onDismiss, ...options } = props;
    
    const content = (
      <div className="flex items-start">
        <div>
          {title && <div className="font-medium">{title}</div>}
          {description && <div className="text-sm text-gray-500">{description}</div>}
        </div>
      </div>
    );
    
    const hotToastOptions = {
      duration,
      ...options
    };
    
    switch(type) {
      case "success":
        return hotToast.success(content, hotToastOptions);
      case "error":
        return hotToast.error(content, hotToastOptions);
      case "loading":
        return hotToast.loading(content, hotToastOptions);
      case "custom":
        return hotToast(content, hotToastOptions);
      default:
        return hotToast(content, hotToastOptions);
    }
  };
  
  return {
    toast,
    dismiss: hotToast.dismiss,
    success: (title: string, options?: Omit<ToastProps, "type" | "title">) => 
      toast({ title, type: "success", ...options }),
    error: (title: string, options?: Omit<ToastProps, "type" | "title">) => 
      toast({ title, type: "error", ...options }),
    loading: (title: string, options?: Omit<ToastProps, "type" | "title">) => 
      toast({ title, type: "loading", ...options }),
    custom: (title: string, options?: Omit<ToastProps, "type" | "title">) => 
      toast({ title, type: "custom", ...options }),
  };
}

// Export a simplified version for direct use
export const toast = {
  success: (message: string) => hotToast.success(message),
  error: (message: string) => hotToast.error(message),
  loading: (message: string) => hotToast.loading(message),
  custom: (message: string) => hotToast(message),
  dismiss: hotToast.dismiss
};
