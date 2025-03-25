
import { Offline } from "react-offline";
import { Wifi, WifiOff } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export function OfflineIndicator() {
  return (
    <Offline>
      <Alert variant="destructive" className="fixed bottom-4 right-4 max-w-md flex items-center">
        <WifiOff className="h-4 w-4 mr-2" />
        <AlertDescription>
          You are currently offline. Some features may be unavailable.
        </AlertDescription>
      </Alert>
    </Offline>
  );
}
