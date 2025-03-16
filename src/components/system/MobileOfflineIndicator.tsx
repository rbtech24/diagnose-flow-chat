
import React from 'react';
import { useOfflineStatus } from '@/hooks/useOfflineStatus';
import { cn } from '@/lib/utils';
import { WifiOff, RefreshCw, Wifi } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';

export function MobileOfflineIndicator() {
  const { isOffline, reconnecting, attemptReconnection, lastOnlineTime, hasPendingChanges } = useOfflineStatus();
  const isMobile = useIsMobile();
  
  if (!isMobile) return null;
  
  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Sheet>
        <SheetTrigger asChild>
          <Button 
            size="icon" 
            className={cn(
              "h-12 w-12 rounded-full shadow-lg",
              isOffline ? "bg-destructive" : 
              reconnecting ? "bg-amber-500" : 
              hasPendingChanges ? "bg-amber-500" : "bg-green-500",
            )}
          >
            {isOffline ? (
              <WifiOff className="h-5 w-5 text-white" />
            ) : reconnecting ? (
              <RefreshCw className="h-5 w-5 text-white animate-spin" />
            ) : (
              <Wifi className="h-5 w-5 text-white" />
            )}
          </Button>
        </SheetTrigger>
        <SheetContent side="bottom" className="rounded-t-xl">
          <SheetHeader className="text-left">
            <SheetTitle>
              {isOffline ? "You're offline" : 
               reconnecting ? "Reconnecting..." : 
               hasPendingChanges ? "Pending changes" : "You're online"}
            </SheetTitle>
          </SheetHeader>
          
          <div className="py-4 space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                {isOffline ? (
                  <WifiOff className="h-5 w-5 text-destructive" />
                ) : reconnecting ? (
                  <RefreshCw className="h-5 w-5 text-amber-500 animate-spin" />
                ) : (
                  <Wifi className="h-5 w-5 text-green-500" />
                )}
                <span className="font-medium">
                  {isOffline ? "Offline Mode" : 
                   reconnecting ? "Reconnecting" : "Online"}
                </span>
              </div>
              
              {isOffline && lastOnlineTime && (
                <span className="text-xs text-muted-foreground">
                  Last online: {formatDistanceToNow(lastOnlineTime, { addSuffix: true })}
                </span>
              )}
            </div>
            
            <Separator />
            
            {isOffline ? (
              <Card>
                <CardContent className="p-4">
                  <p className="text-sm">
                    You're working offline. Your changes will be saved locally and synchronized when you go back online.
                  </p>
                  <Button 
                    variant="outline" 
                    className="w-full mt-4" 
                    onClick={attemptReconnection}
                  >
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Check connection
                  </Button>
                </CardContent>
              </Card>
            ) : hasPendingChanges ? (
              <Card>
                <CardContent className="p-4 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Pending changes</span>
                    <Badge variant="outline">Sync required</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    You have changes that need to be synchronized with the server.
                  </p>
                  <Button 
                    variant="default" 
                    className="w-full mt-2" 
                    onClick={attemptReconnection}
                  >
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Sync now
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="p-4">
                  <p className="text-sm">
                    All your data is up-to-date and synchronized with the server.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
