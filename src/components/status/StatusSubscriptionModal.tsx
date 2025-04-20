import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "react-hot-toast";
import { Mail } from "lucide-react";

interface StatusSubscriptionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function StatusSubscriptionModal({ open, onOpenChange }: StatusSubscriptionModalProps) {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    setIsLoading(true);
    
    try {
      // Here you would normally have an API call to subscribe the user
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success("You will now receive status updates to your email.");
      
      setEmail("");
      onOpenChange(false);
    } catch (error) {
      toast.error("There was an error subscribing to status updates.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95%] max-w-md mx-auto p-4 sm:p-6">
        <DialogHeader className="text-center sm:text-left">
          <DialogTitle className="text-lg sm:text-xl">Subscribe to Status Updates</DialogTitle>
          <DialogDescription className="text-sm">
            Get notified when there are system outages or maintenance events.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubscribe} className="space-y-4 py-2 sm:py-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium">Email address</Label>
            <div className="flex items-center space-x-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 text-sm sm:text-base"
                required
              />
            </div>
          </div>
          
          <DialogFooter className="pt-2 sm:pt-4">
            <Button
              type="submit"
              className="w-full text-sm sm:text-base"
              disabled={isLoading}
            >
              {isLoading ? "Subscribing..." : "Subscribe"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
