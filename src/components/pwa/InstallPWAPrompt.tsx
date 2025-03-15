
import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { X } from 'lucide-react';

// Interface for the beforeinstallprompt event
interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function InstallPWAPrompt() {
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const isMobile = useIsMobile();
  
  useEffect(() => {
    // Check if already installed
    const isAppInstalled = window.matchMedia('(display-mode: standalone)').matches;
    if (isAppInstalled) return;
    
    // Save the install prompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e as BeforeInstallPromptEvent);
      
      // Only show on mobile devices
      if (isMobile) {
        // Show after a short delay
        setTimeout(() => setIsOpen(true), 3000);
      }
    };
    
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, [isMobile]);
  
  // Handle install action
  const handleInstall = async () => {
    if (!installPrompt) return;
    
    // Show the install prompt
    await installPrompt.prompt();
    
    // Get the user's choice
    const choiceResult = await installPrompt.userChoice;
    
    if (choiceResult.outcome === 'accepted') {
      console.log('User accepted the install prompt');
    } else {
      console.log('User dismissed the install prompt');
    }
    
    // Clear the prompt
    setInstallPrompt(null);
    setIsOpen(false);
  };
  
  if (!installPrompt || !isMobile) return null;
  
  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent side="bottom" className="rounded-t-xl p-6">
        <SheetHeader className="flex justify-between items-start">
          <SheetTitle className="text-xl">Add to Home Screen</SheetTitle>
          <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
            <X className="h-4 w-4" />
          </Button>
        </SheetHeader>
        
        <SheetDescription className="py-4">
          Install Repair Auto Pilot as an app on your device for quick access to diagnostics, even offline.
        </SheetDescription>
        
        <div className="flex items-center justify-center my-4">
          <img 
            src="/lovable-uploads/868fa51f-a29b-4816-a866-c3f9cbdfac9e.png" 
            alt="Repair Auto Pilot" 
            className="h-16"
          />
        </div>
        
        <SheetFooter>
          <Button 
            onClick={handleInstall} 
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            Install App
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
