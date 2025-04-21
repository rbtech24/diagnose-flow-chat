
// This is a compatibility component for shadcn/ui
// The actual toasts are rendered by react-hot-toast
import { Toaster as HotToaster } from 'react-hot-toast';

// Debug log for toaster.tsx loading
console.log("UI toaster.tsx module loaded");

export function Toaster() {
  console.log("Toaster component rendering");
  return <HotToaster position="bottom-right" toastOptions={{ duration: 5000 }} />;
}
