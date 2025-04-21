
import { toast } from "react-hot-toast";

// For debugging purposes
console.log("Toast helpers loaded");

export const showToast = {
  success: (message: string) => {
    console.log("Success toast:", message);
    return toast.success(message);
  },
  error: (message: string) => {
    console.log("Error toast:", message);
    return toast.error(message);
  },
  info: (message: string) => {
    console.log("Info toast:", message);
    return toast.success(message, { icon: "ℹ️" });
  },
  warning: (message: string) => {
    console.log("Warning toast:", message);
    return toast.error(message, { icon: "⚠️" });
  }
};
