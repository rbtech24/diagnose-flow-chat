
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { CloudOff, RefreshCw, CheckCircle2, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useOfflineStatus } from '@/hooks/useOfflineStatus';
import { useIsMobile } from '@/hooks/use-mobile';

interface SyncStatusBadgeProps {
  syncItems?: number;
  syncType?: 'knowledge' | 'workflow' | 'community';
  className?: string;
  variant?: 'badge' | 'icon-only' | 'text';
  showLabel?: boolean;
}

export function SyncStatusBadge({ 
  syncItems = 0, 
  syncType = 'community',
  className,
  variant = 'badge',
  showLabel = true
}: SyncStatusBadgeProps) {
  const { isOffline, reconnecting } = useOfflineStatus();
  const isMobile = useIsMobile();
  
  // Format the module name for display
  const moduleLabel = syncType.charAt(0).toUpperCase() + syncType.slice(1);
  
  const getBadgeVariant = () => {
    if (isOffline) return 'destructive';
    if (reconnecting || syncItems > 0) return 'warning';
    return 'success';
  };
  
  const getIcon = () => {
    if (isOffline) return <CloudOff className="h-3.5 w-3.5" />;
    if (reconnecting) return <RefreshCw className="h-3.5 w-3.5 animate-spin" />;
    if (syncItems > 0) return <AlertTriangle className="h-3.5 w-3.5" />;
    return <CheckCircle2 className="h-3.5 w-3.5" />;
  };
  
  const getMessage = () => {
    if (isOffline) return `Offline - ${moduleLabel} changes will sync when online`;
    if (reconnecting) return `Reconnecting - Syncing ${moduleLabel.toLowerCase()} data`;
    if (syncItems > 0) return `${syncItems} pending ${moduleLabel.toLowerCase()} ${syncItems === 1 ? 'change' : 'changes'}`;
    return `${moduleLabel} data in sync`;
  };
  
  const getLabel = () => {
    if (isOffline) return 'Offline';
    if (reconnecting) return 'Syncing...';
    if (syncItems > 0) return `${syncItems} pending`;
    return 'Synced';
  };
  
  if (variant === 'icon-only') {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div 
              className={cn(
                "flex items-center justify-center h-8 w-8 rounded-full",
                isOffline ? "bg-destructive/10 text-destructive" : 
                reconnecting || syncItems > 0 ? "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300" : 
                "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300",
                className
              )}
            >
              {getIcon()}
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>{getMessage()}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }
  
  if (variant === 'text') {
    return (
      <div className={cn("flex items-center gap-1.5 text-xs", className)}>
        {getIcon()}
        <span>{getMessage()}</span>
      </div>
    );
  }
  
  // Default badge variant
  return (
    <Badge 
      variant={getBadgeVariant() as any}
      className={cn(
        "gap-1.5",
        isMobile && !showLabel ? "px-1.5" : "px-2.5",
        className
      )}
    >
      {getIcon()}
      {(!isMobile || showLabel) && <span>{getLabel()}</span>}
    </Badge>
  );
}
