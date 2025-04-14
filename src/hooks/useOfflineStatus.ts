
import { useState, useEffect, useCallback } from 'react';
import { hasPendingChanges } from '@/utils/offlineStorage';

/**
 * A hook to track the online/offline status of the application
 * @returns An object containing the current online status and related utilities
 */
export function useOfflineStatus() {
  const [isOffline, setIsOffline] = useState<boolean>(!navigator.onLine);
  const [reconnecting, setReconnecting] = useState<boolean>(false);
  const [lastOnlineTime, setLastOnlineTime] = useState<Date | null>(
    navigator.onLine ? new Date() : null
  );
  const [hasPendingSync, setHasPendingSync] = useState<boolean>(false);

  // Check for pending changes on initialization
  useEffect(() => {
    const checkPendingChanges = async () => {
      try {
        const pending = await hasPendingChanges();
        setHasPendingSync(pending);
      } catch (error) {
        console.error('Error checking pending changes:', error);
      }
    };

    checkPendingChanges();
    
    // Set up an interval to periodically check for pending changes
    const interval = setInterval(checkPendingChanges, 30000);
    return () => clearInterval(interval);
  }, []);

  // Handle online/offline status changes
  useEffect(() => {
    const handleOnline = () => {
      setIsOffline(false);
      setLastOnlineTime(new Date());
      setReconnecting(true);
      
      // After a short delay, turn off reconnecting status
      setTimeout(() => {
        setReconnecting(false);
      }, 3000);
    };
    
    const handleOffline = () => {
      setIsOffline(true);
      setReconnecting(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Function to manually attempt reconnection
  const attemptReconnection = useCallback(() => {
    if (navigator.onLine && isOffline) {
      setIsOffline(false);
      setLastOnlineTime(new Date());
    }
    
    setReconnecting(true);
    
    // Simulate reconnection attempt
    setTimeout(() => {
      setReconnecting(false);
      // Update offline status based on navigator.onLine
      setIsOffline(!navigator.onLine);
    }, 2000);
  }, [isOffline]);

  return { 
    isOffline,
    reconnecting,
    attemptReconnection,
    lastOnlineTime,
    hasPendingChanges: hasPendingSync
  };
}
