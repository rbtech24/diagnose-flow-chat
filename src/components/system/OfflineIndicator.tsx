
import React, { useState, useEffect } from 'react';
import { useOfflineStatus } from '@/hooks/useOfflineStatus';
import { Button } from '@/components/ui/button';
import { Wifi, WifiOff, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';

export function OfflineIndicator() {
  const { isOffline, reconnecting, attemptReconnection } = useOfflineStatus();
  const [show, setShow] = useState(false);
  
  // Only show the indicator after a short delay to prevent flashing
  useEffect(() => {
    let timeoutId: number;
    
    if (isOffline) {
      timeoutId = window.setTimeout(() => setShow(true), 500);
    } else {
      setShow(false);
    }
    
    return () => {
      clearTimeout(timeoutId);
    };
  }, [isOffline]);
  
  if (!show && !reconnecting) {
    return null;
  }
  
  return (
    <div
      className={cn(
        'fixed bottom-4 left-4 z-50 flex items-center gap-3 rounded-lg px-4 py-2 shadow-md transition-all duration-300',
        isOffline
          ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100'
          : reconnecting
          ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100'
          : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100',
        {
          'translate-y-0 opacity-100': show || reconnecting,
          'translate-y-16 opacity-0': !show && !reconnecting
        }
      )}
    >
      {isOffline ? (
        <>
          <WifiOff className="h-5 w-5" />
          <div className="flex flex-col">
            <span className="text-sm font-medium">You're offline</span>
            <span className="text-xs">Changes will sync when you reconnect</span>
          </div>
          <Button
            size="sm"
            variant="outline"
            className={cn(
              'ml-2 h-8',
              'border-red-300 bg-red-50 hover:bg-red-100 dark:border-red-700 dark:bg-red-800 dark:hover:bg-red-700'
            )}
            onClick={() => attemptReconnection()}
          >
            <RefreshCw className="mr-1 h-3 w-3" />
            Retry
          </Button>
        </>
      ) : reconnecting ? (
        <>
          <RefreshCw className="h-5 w-5 animate-spin" />
          <div className="flex flex-col">
            <span className="text-sm font-medium">Reconnecting...</span>
            <span className="text-xs">Syncing your changes</span>
          </div>
        </>
      ) : (
        <>
          <Wifi className="h-5 w-5" />
          <div className="flex flex-col">
            <span className="text-sm font-medium">Back online</span>
            <span className="text-xs">All changes synced</span>
          </div>
        </>
      )}
    </div>
  );
}
