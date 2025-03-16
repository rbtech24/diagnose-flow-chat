
import React, { useState } from "react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, InfoIcon, BellRing, X } from "lucide-react";
import { Button } from "@/components/ui/button";

type MessageType = "warning" | "info" | "maintenance" | "success";

interface SystemMessageProps {
  type: MessageType;
  title: string;
  message: string;
  visible?: boolean;
  dismissible?: boolean;
  onDismiss?: () => void;
  id?: string;
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
    case "success":
      return {
        bg: "bg-green-50",
        border: "border-green-200",
        icon: <BellRing className="h-4 w-4 text-green-600" />,
        titleColor: "text-green-900",
        textColor: "text-green-700"
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

export function SystemMessage({ 
  type, 
  title, 
  message, 
  visible = true, 
  dismissible = false,
  onDismiss,
  id
}: SystemMessageProps) {
  const [isDismissed, setIsDismissed] = useState(false);
  
  if (!visible || isDismissed) return null;
  
  const styles = getMessageStyles(type);
  
  const handleDismiss = () => {
    setIsDismissed(true);
    if (onDismiss) {
      onDismiss();
    }
  };
  
  return (
    <Alert className={`mb-6 ${styles.bg} ${styles.border} relative`} data-message-id={id}>
      <div className="flex items-start gap-4">
        <div className={`rounded-full ${styles.bg.replace('bg-', 'bg-')} p-2`}>
          {styles.icon}
        </div>
        <div>
          <AlertTitle className={`font-medium ${styles.titleColor}`}>{title}</AlertTitle>
          <AlertDescription className={`text-sm ${styles.textColor}`}>
            {message}
          </AlertDescription>
        </div>
      </div>
      
      {dismissible && (
        <Button 
          variant="ghost" 
          size="icon" 
          className="absolute top-2 right-2 h-6 w-6 rounded-full" 
          onClick={handleDismiss}
        >
          <X className="h-3 w-3" />
          <span className="sr-only">Dismiss</span>
        </Button>
      )}
    </Alert>
  );
}
