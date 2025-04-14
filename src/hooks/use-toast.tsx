
import React from "react";
import { toast as hotToast, Toast as HotToast } from "react-hot-toast";

type ToastType = "success" | "error" | "loading" | "custom";

interface ToastOptions {
  duration?: number;
  position?: "top-left" | "top-center" | "top-right" | "bottom-left" | "bottom-center" | "bottom-right";
  icon?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

interface ToastProps extends ToastOptions {
  id?: string;
  title?: string;
  description?: string;
  type: ToastType;
  onDismiss?: () => void;
}

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
    
    switch(type) {
      case "success":
        return hotToast.success(content, { duration, ...options });
      case "error":
        return hotToast.error(content, { duration, ...options });
      case "loading":
        return hotToast.loading(content, { duration, ...options });
      case "custom":
        return hotToast(content, { duration, ...options });
      default:
        return hotToast(content, { duration, ...options });
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
