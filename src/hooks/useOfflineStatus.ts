
import { useState, useEffect } from 'react';
import { initNetworkStatusListeners, hasPendingChanges } from '@/utils/offlineStorage';

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
  const [hasPending, setHasPending] = useState(false);

  // Check for pending changes
  useEffect(() => {
    const checkPending = async () => {
      const pending = await hasPendingChanges();
      setHasPending(pending);
    };
    
    checkPending();
    
    // Set up interval to check for pending changes
    const interval = setInterval(checkPending, 30000);
    return () => clearInterval(interval);
  }, []);

  // Handle online/offline events
  useEffect(() => {
    const handleOnline = () => {
      setReconnecting(true);
      
      // Update last online time
      setLastOnlineTime(new Date());
      
      // Check for pending changes
      hasPendingChanges().then(pending => {
        setHasPending(pending);
        
        // If there are pending changes, try to trigger background sync
        if (pending && 'serviceWorker' in navigator && 'SyncManager' in window) {
          navigator.serviceWorker.ready
            .then(registration => {
              // Trigger sync for knowledge and workflow updates
              return Promise.all([
                (registration as SyncRegistration).sync.register('sync-knowledge-updates'),
                (registration as SyncRegistration).sync.register('sync-workflow-updates')
              ]);
            })
            .catch(error => {
              console.error('Failed to register background sync:', error);
            });
        }
        
        // Set a timeout to update the reconnecting state
        setTimeout(() => {
          setReconnecting(false);
          setIsOffline(false);
        }, 1500);
      });
    };

    const handleOffline = () => {
      setIsOffline(true);
    };

    const cleanup = initNetworkStatusListeners(handleOnline, handleOffline);
    
    // Listen for service worker messages
    const handleServiceWorkerMessage = (event: MessageEvent) => {
      if (event.data && event.data.type === 'SYNC_COMPLETE') {
        console.log('Received sync complete message:', event.data);
        
        // Update pending status
        setHasPending(event.data.remainingCount > 0);
        
        // If sync is complete and there are no remaining items, update reconnecting state
        if (event.data.remainingCount === 0) {
          setReconnecting(false);
        }
      }
      
      if (event.data && event.data.type === 'SYNC_SUCCESS') {
        console.log('Received sync success message:', event.data);
      }
    };
    
    // Add listener for service worker messages
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('message', handleServiceWorkerMessage);
    }

    return () => {
      cleanup();
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.removeEventListener('message', handleServiceWorkerMessage);
      }
    };
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
        // If service worker is available but SyncManager is not
        if ('serviceWorker' in navigator) {
          navigator.serviceWorker.ready.then(registration => {
            // Send message to service worker to manually trigger sync
            registration.active?.postMessage({
              type: 'MANUAL_SYNC',
              tag: 'sync-knowledge-updates'
            });
            
            registration.active?.postMessage({
              type: 'MANUAL_SYNC',
              tag: 'sync-workflow-updates'
            });
          });
        }
        
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
    hasPendingChanges: hasPending,
    attemptReconnection
  };
}
