
import React from 'react';
import { useOfflineStatus } from '@/hooks/useOfflineStatus';
import { AlertCircle, WifiOff, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';

export function OfflineIndicator() {
  const { isOffline, reconnecting, attemptReconnection } = useOfflineStatus();
  const isMobile = useIsMobile();
  
  // Don't show on mobile devices - MobileOfflineIndicator will handle that
  if (isMobile) return null;
  
  // Don't render anything if online and not reconnecting
  if (!isOffline && !reconnecting) return null;
  
  return (
    <div className="fixed top-4 right-4 z-50 max-w-md">
      <Alert 
        variant={isOffline ? "destructive" : "default"}
        className={cn(
          "shadow-lg",
          reconnecting ? "bg-amber-50 text-amber-900 border-amber-200" : ""
        )}
      >
        {isOffline ? (
          <WifiOff className="h-4 w-4" />
        ) : reconnecting ? (
          <RefreshCw className="h-4 w-4 animate-spin" />
        ) : (
          <AlertCircle className="h-4 w-4" />
        )}
        <AlertTitle>
          {isOffline ? "You are offline" : reconnecting ? "Reconnecting..." : "Connection alert"}
        </AlertTitle>
        <AlertDescription className="flex flex-col gap-2">
          {isOffline ? (
            <>
              <p>Your changes will be saved locally and synchronized when you're back online.</p>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={attemptReconnection}
                className="w-fit"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Reconnect
              </Button>
            </>
          ) : reconnecting ? (
            <p>Attempting to restore connection and sync changes...</p>
          ) : (
            <p>Connection status changed.</p>
          )}
        </AlertDescription>
      </Alert>
    </div>
  );
}
