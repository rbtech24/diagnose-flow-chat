
import { toast } from "react-hot-toast";

export const showToast = {
  success: (message: string) => toast.success(message),
  error: (message: string) => toast.error(message),
  info: (message: string) => toast.success(message, { icon: "ℹ️" }),
  warning: (message: string) => toast.error(message, { icon: "⚠️" })
};
