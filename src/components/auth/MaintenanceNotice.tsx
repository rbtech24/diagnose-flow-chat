
import React from 'react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface MaintenanceNoticeProps {
  onRetry?: () => void;
}

export function MaintenanceNotice({ onRetry }: MaintenanceNoticeProps) {
  return (
    <Alert variant="destructive" className="mb-6">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Authentication System Maintenance</AlertTitle>
      <AlertDescription className="mt-2">
        <p className="mb-2">
          Our authentication system is currently experiencing technical issues. 
          We apologize for the inconvenience.
        </p>
        <p className="mb-4">
          Our team has been notified and is working on resolving this issue as quickly as possible.
        </p>
        
        {onRetry && (
          <Button 
            variant="outline" 
            onClick={onRetry}
            className="bg-white hover:bg-gray-50 border-red-300"
            size="sm"
          >
            Try Again
          </Button>
        )}
      </AlertDescription>
    </Alert>
  );
}
