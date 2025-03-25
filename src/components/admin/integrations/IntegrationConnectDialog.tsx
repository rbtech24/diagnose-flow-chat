
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Lock } from "lucide-react";
import { useApiIntegrationsStore } from "@/store/apiIntegrationsStore";

interface IntegrationConnectDialogProps {
  integration: {
    id: string;
    name: string;
    category: string;
    description?: string;
    status: string; // Added this property to fix the error
  };
  isOpen: boolean;
  onClose: () => void;
}

export function IntegrationConnectDialog({ integration, isOpen, onClose }: IntegrationConnectDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { connectIntegration } = useApiIntegrationsStore();
  const [formData, setFormData] = useState({
    apiKey: '',
    apiSecret: '',
    additionalSettings: {}
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Prepare credentials and config
      const credentials = {
        apiKey: formData.apiKey,
        apiSecret: formData.apiSecret
      };

      const config = {
        ...formData.additionalSettings
      };

      // Connect the integration
      const success = await connectIntegration(integration, config, credentials);
      
      if (success) {
        onClose();
      }
    } catch (error) {
      console.error("Error connecting integration:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Connect {integration.name}</DialogTitle>
          <DialogDescription>
            Enter your API credentials to connect with {integration.name}.
            All credentials are encrypted before being stored.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="apiKey">API Key</Label>
            <div className="flex items-center rounded-md border">
              <Lock className="h-4 w-4 mx-3 text-muted-foreground" />
              <Input 
                id="apiKey"
                name="apiKey"
                className="flex-1 border-0"
                value={formData.apiKey}
                onChange={handleInputChange}
                placeholder="Enter your API key"
                required
              />
            </div>
          </div>

          {integration.id !== "sendgrid" && (
            <div className="space-y-2">
              <Label htmlFor="apiSecret">API Secret</Label>
              <div className="flex items-center rounded-md border">
                <Lock className="h-4 w-4 mx-3 text-muted-foreground" />
                <Input 
                  id="apiSecret"
                  name="apiSecret"
                  type="password"
                  className="flex-1 border-0"
                  value={formData.apiSecret}
                  onChange={handleInputChange}
                  placeholder="Enter your API secret"
                />
              </div>
            </div>
          )}

          {integration.id === "openai" && (
            <div className="space-y-2">
              <Label htmlFor="organization">Organization ID (optional)</Label>
              <Input 
                id="organization"
                name="organization"
                value={formData.additionalSettings['organization'] || ''}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  additionalSettings: {
                    ...prev.additionalSettings,
                    organization: e.target.value
                  }
                }))}
                placeholder="Enter your organization ID"
              />
            </div>
          )}

          {integration.id === "twilio" && (
            <div className="space-y-2">
              <Label htmlFor="accountSid">Account SID</Label>
              <Input 
                id="accountSid"
                name="accountSid"
                value={formData.additionalSettings['accountSid'] || ''}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  additionalSettings: {
                    ...prev.additionalSettings,
                    accountSid: e.target.value
                  }
                }))}
                placeholder="Enter your Twilio Account SID"
                required
              />
            </div>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Connecting..." : "Connect"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
