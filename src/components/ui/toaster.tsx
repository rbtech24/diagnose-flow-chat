
// This is a compatibility component for shadcn/ui
// The actual toasts are rendered by react-hot-toast
import { Toaster as HotToaster } from 'react-hot-toast';

export function Toaster() {
  return <HotToaster position="bottom-right" toastOptions={{ duration: 5000 }} />;
}
