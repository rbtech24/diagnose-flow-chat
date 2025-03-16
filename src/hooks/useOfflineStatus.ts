
import { useState, useEffect } from 'react';
import { initNetworkStatusListeners } from '@/utils/offlineStorage';

// Define interface for browser that supports SyncManager
interface SyncRegistration extends ServiceWorkerRegistration {
  sync: {
    register(tag: string): Promise<void>;
  }
}

/**
 * Hook to track online/offline status and manage reconnection
 */
export function useOfflineStatus() {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [reconnecting, setReconnecting] = useState(false);
  const [lastOnlineTime, setLastOnlineTime] = useState<Date | null>(
    navigator.onLine ? new Date() : null
  );

  useEffect(() => {
    const handleOnline = () => {
      setReconnecting(true);
      
      // Simulate a short delay to allow background sync to complete
      setTimeout(() => {
        setIsOffline(false);
        setReconnecting(false);
        setLastOnlineTime(new Date());
      }, 1500);
    };

    const handleOffline = () => {
      setIsOffline(true);
    };

    const cleanup = initNetworkStatusListeners(handleOnline, handleOffline);

    return cleanup;
  }, []);

  // Function to manually trigger a sync attempt
  const attemptReconnection = () => {
    if (navigator.onLine) {
      setReconnecting(true);
      
      // Trigger any background sync operations if available
      if ('serviceWorker' in navigator && 'SyncManager' in window) {
        navigator.serviceWorker.ready
          .then(registration => {
            // Type cast to our interface with sync property
            return Promise.all([
              (registration as SyncRegistration).sync.register('sync-knowledge-updates'),
              (registration as SyncRegistration).sync.register('sync-workflow-updates')
            ]);
          })
          .catch(error => {
            console.error('Failed to register background sync:', error);
          })
          .finally(() => {
            setTimeout(() => {
              setIsOffline(false);
              setReconnecting(false);
              setLastOnlineTime(new Date());
            }, 1500);
          });
      } else {
        // Fallback if background sync is not available
        setTimeout(() => {
          setIsOffline(false);
          setReconnecting(false);
          setLastOnlineTime(new Date());
        }, 1500);
      }
    }
  };

  return {
    isOffline,
    reconnecting,
    lastOnlineTime,
    attemptReconnection
  };
}
