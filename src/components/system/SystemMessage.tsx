
import { AlertCircle, CheckCircle, Info, XCircle, X } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { MessageType } from "@/context/SystemMessageContext";

interface SystemMessageProps {
  id: string;
  type: MessageType;
  title: string;
  message: string;
  dismissible?: boolean;
  onDismiss?: (id: string) => void;
}

export function SystemMessage({ 
  id, 
  type, 
  title, 
  message, 
  dismissible = true, 
  onDismiss 
}: SystemMessageProps) {
  const getIcon = () => {
    switch (type) {
      case 'info':
        return <Info className="h-4 w-4" />;
      case 'warning':
        return <AlertCircle className="h-4 w-4" />;
      case 'error':
        return <XCircle className="h-4 w-4" />;
      case 'success':
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <Info className="h-4 w-4" />;
    }
  };

  const getVariant = () => {
    switch (type) {
      case 'info':
        return 'default';
      case 'warning':
        return 'warning';
      case 'error':
        return 'destructive';
      case 'success':
        return 'success';
      default:
        return 'default';
    }
  };

  return (
    <Alert 
      variant={getVariant() as any} 
      className="mb-4 relative"
    >
      {getIcon()}
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>{message}</AlertDescription>
      
      {dismissible && onDismiss && (
        <Button 
          variant="ghost" 
          size="icon" 
          className="absolute top-2 right-2 h-6 w-6"
          onClick={() => onDismiss(id)}
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Dismiss</span>
        </Button>
      )}
    </Alert>
  );
}
