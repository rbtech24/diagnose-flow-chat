
import { useState, useEffect } from 'react';
import { useOfflineStatus } from './useOfflineStatus';
import { communityStorage } from '@/utils/offlineStorage';
import { showSyncNotification } from '@/components/system/SyncStatusIndicator';

type SyncStatus = 'idle' | 'syncing' | 'success' | 'error';

export function useCommunitySync() {
  const { isOffline } = useOfflineStatus();
  const [syncStatus, setSyncStatus] = useState<SyncStatus>('idle');
  const [pendingChanges, setPendingChanges] = useState(0);
  const [processedChanges, setProcessedChanges] = useState(0);
  
  // Check for pending changes on load and when online status changes
  useEffect(() => {
    const checkPendingUpdates = async () => {
      try {
        const pendingUpdates = await communityStorage.getPendingUpdates();
        setPendingChanges(pendingUpdates.length);
      } catch (error) {
        console.error('Error checking pending community updates:', error);
      }
    };
    
    checkPendingUpdates();
    
    // Listen for service worker messages about sync completion
    const handleServiceWorkerMessage = (event: MessageEvent) => {
      if (event.data && event.data.type === 'SYNC_COMPLETE' && event.data.tag === 'sync-community-updates') {
        setProcessedChanges(event.data.syncedCount || 0);
        setPendingChanges(event.data.remainingCount || 0);
        
        if (event.data.syncedCount > 0) {
          showSyncNotification(
            'success', 
            `Successfully synced ${event.data.syncedCount} community ${event.data.syncedCount === 1 ? 'post' : 'posts'}`
          );
        }
        
        if (event.data.remainingCount === 0) {
          setSyncStatus('success');
        }
      }
      
      if (event.data && event.data.type === 'SYNC_ERROR' && event.data.tag === 'sync-community-updates') {
        setSyncStatus('error');
        showSyncNotification('error', `Failed to sync some community posts: ${event.data.error}`);
      }
    };
    
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('message', handleServiceWorkerMessage);
    }
    
    return () => {
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.removeEventListener('message', handleServiceWorkerMessage);
      }
    };
  }, [isOffline]);
  
  // Function to manually trigger sync
  const syncOfflineChanges = async () => {
    if (isOffline) {
      showSyncNotification('warning', 'Cannot sync while offline');
      return;
    }
    
    setSyncStatus('syncing');
    showSyncNotification('warning', 'Syncing community posts...');
    
    try {
      // If service worker is available and supports background sync
      if ('serviceWorker' in navigator && 'SyncManager' in window) {
        const registration = await navigator.serviceWorker.ready;
        await registration.sync.register('sync-community-updates');
        setProcessedChanges(0);
      } else {
        // Manual sync fallback
        const pendingUpdates = await communityStorage.getPendingUpdates();
        let successful = 0;
        
        for (const update of pendingUpdates) {
          try {
            // Simulate API call (would be real in production)
            await new Promise(resolve => setTimeout(resolve, 300));
            await communityStorage.removePendingUpdate(update.id!);
            successful++;
            setProcessedChanges(successful);
          } catch (error) {
            console.error('Error processing update:', error);
          }
        }
        
        setPendingChanges(pendingUpdates.length - successful);
        
        if (successful > 0) {
          showSyncNotification(
            'success', 
            `Successfully synced ${successful} community ${successful === 1 ? 'post' : 'posts'}`
          );
        }
        
        if (pendingUpdates.length - successful > 0) {
          showSyncNotification(
            'error', 
            `Failed to sync ${pendingUpdates.length - successful} community ${(pendingUpdates.length - successful) === 1 ? 'post' : 'posts'}`
          );
        }
        
        setSyncStatus(successful === pendingUpdates.length ? 'success' : 'error');
      }
    } catch (error) {
      console.error('Error syncing community updates:', error);
      setSyncStatus('error');
      showSyncNotification('error', 'Failed to sync community posts');
    }
  };
  
  return {
    syncStatus,
    pendingChanges,
    processedChanges,
    syncOfflineChanges
  };
}
