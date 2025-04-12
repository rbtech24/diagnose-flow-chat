
// This file now redirects to the correct implementation in hooks/use-toast
import { useToast, toast, type Toast, type ToastProps } from "@/hooks/use-toast";

// Export the Toaster component directly from react-hot-toast for backward compatibility
import { Toaster as ToastProvider } from 'react-hot-toast';

export { useToast, toast, ToastProvider, type Toast, type ToastProps };
