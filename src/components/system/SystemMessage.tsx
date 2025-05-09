
import React from "react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, InfoIcon, BellRing } from "lucide-react";

type MessageType = "warning" | "info" | "maintenance";

interface SystemMessageProps {
  type: MessageType;
  title: string;
  message: string;
  visible?: boolean;
}

const getMessageStyles = (type: MessageType) => {
  switch (type) {
    case "warning":
      return {
        bg: "bg-amber-50",
        border: "border-amber-200",
        icon: <AlertTriangle className="h-4 w-4 text-amber-600" />,
        titleColor: "text-amber-900",
        textColor: "text-amber-700"
      };
    case "maintenance":
      return {
        bg: "bg-red-50",
        border: "border-red-200",
        icon: <AlertTriangle className="h-4 w-4 text-red-600" />,
        titleColor: "text-red-900",
        textColor: "text-red-700"
      };
    case "info":
    default:
      return {
        bg: "bg-blue-50",
        border: "border-blue-200",
        icon: <InfoIcon className="h-4 w-4 text-blue-600" />,
        titleColor: "text-blue-900",
        textColor: "text-blue-700"
      };
  }
};

export function SystemMessage({ type, title, message, visible = true }: SystemMessageProps) {
  if (!visible) return null;
  
  const styles = getMessageStyles(type);
  
  return (
    <Alert className={`mb-6 ${styles.bg} ${styles.border}`}>
      <div className="flex items-start gap-4">
        <div className="rounded-full p-2">
          {styles.icon}
        </div>
        <div>
          <AlertTitle className={`font-medium ${styles.titleColor}`}>{title}</AlertTitle>
          <AlertDescription className={`text-sm ${styles.textColor}`}>
            {message}
          </AlertDescription>
        </div>
      </div>
    </Alert>
  );
}
