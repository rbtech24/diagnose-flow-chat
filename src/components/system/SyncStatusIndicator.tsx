
import React from 'react';
import { useOfflineStatus } from '@/hooks/useOfflineStatus';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Cloud, CloudOff, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { toast as hotToast } from 'react-hot-toast';

interface SyncStatusIndicatorProps {
  syncItems?: number;
  processedItems?: number;
  showDetails?: boolean;
  moduleName?: string;
}

export function SyncStatusIndicator({ 
  syncItems = 0, 
  processedItems = 0, 
  showDetails = false,
  moduleName = 'Changes'
}: SyncStatusIndicatorProps) {
  const { isOffline, reconnecting, lastOnlineTime } = useOfflineStatus();
  
  const syncProgress = syncItems > 0 ? Math.round((processedItems / syncItems) * 100) : 0;
  
  if (isOffline) {
    return (
      <Alert variant="destructive" className="mb-4">
        <CloudOff className="h-4 w-4 mr-2" />
        <AlertDescription className="flex items-center justify-between">
          <span>You're working offline. {moduleName} will sync when you reconnect.</span>
          {showDetails && lastOnlineTime && (
            <span className="text-xs">Last online: {lastOnlineTime.toLocaleString()}</span>
          )}
        </AlertDescription>
      </Alert>
    );
  }
  
  if (reconnecting) {
    return (
      <Alert variant="warning" className="mb-4">
        <AlertCircle className="h-4 w-4 mr-2" />
        <AlertDescription className="space-y-2">
          <div className="flex justify-between">
            <span>Syncing your {moduleName.toLowerCase()}...</span>
            <span>{processedItems} of {syncItems}</span>
          </div>
          {syncItems > 0 && (
            <Progress value={syncProgress} className="h-2" aria-label={`${syncProgress}% complete`} />
          )}
        </AlertDescription>
      </Alert>
    );
  }
  
  if (syncItems > 0 && processedItems === syncItems) {
    return (
      <Alert variant="success" className="mb-4">
        <CheckCircle2 className="h-4 w-4 mr-2" />
        <AlertDescription>
          All {moduleName.toLowerCase()} have been synchronized successfully!
        </AlertDescription>
      </Alert>
    );
  }
  
  return null;
}

// Function to show toast notifications for sync events
export function showSyncNotification(type: 'success' | 'error' | 'warning', message: string) {
  if (type === 'success') {
    hotToast.success(message);
  } else if (type === 'error') {
    hotToast.error(message);
  } else {
    hotToast(message);
  }
}
