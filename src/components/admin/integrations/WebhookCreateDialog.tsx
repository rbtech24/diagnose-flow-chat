
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useApiIntegrationsStore } from "@/store/apiIntegrationsStore";

interface WebhookCreateDialogProps {
  isOpen: boolean;
  onClose: () => void;
  integrationId: string;
}

export function WebhookCreateDialog({ isOpen, onClose, integrationId }: WebhookCreateDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { createWebhook } = useApiIntegrationsStore();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    url: '',
    events: [] as string[]
  });

  const availableEvents = [
    { id: 'payment_success', label: 'Payment Success' },
    { id: 'payment_failed', label: 'Payment Failed' },
    { id: 'customer_created', label: 'Customer Created' },
    { id: 'subscription_updated', label: 'Subscription Updated' }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleEventToggle = (eventId: string) => {
    setFormData(prev => {
      const events = prev.events.includes(eventId)
        ? prev.events.filter(id => id !== eventId)
        : [...prev.events, eventId];

      return { ...prev, events };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.events.length === 0) {
      alert("Please select at least one event");
      return;
    }
    
    setIsSubmitting(true);

    try {
      // Create webhook
      const success = await createWebhook({
        name: formData.name,
        description: formData.description,
        url: formData.url,
        events: formData.events,
        integration_id: integrationId
      });
      
      if (success) {
        onClose();
      }
    } catch (error) {
      console.error("Error creating webhook:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create Webhook Endpoint</DialogTitle>
          <DialogDescription>
            Set up a new webhook endpoint to receive event notifications.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Webhook Name</Label>
            <Input 
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter webhook name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea 
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Enter webhook description"
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="url">Endpoint URL</Label>
            <Input 
              id="url"
              name="url"
              value={formData.url}
              onChange={handleInputChange}
              placeholder="https://your-service.com/webhook"
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Events to Subscribe</Label>
            <div className="mt-2 border rounded-md p-3 space-y-2">
              {availableEvents.map(event => (
                <div key={event.id} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`event-${event.id}`}
                    checked={formData.events.includes(event.id)}
                    onCheckedChange={() => handleEventToggle(event.id)}
                  />
                  <Label htmlFor={`event-${event.id}`} className="cursor-pointer">
                    {event.label}
                  </Label>
                </div>
              ))}
            </div>
            {formData.events.length === 0 && (
              <p className="text-sm text-red-500">Select at least one event</p>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || formData.events.length === 0}>
              {isSubmitting ? "Creating..." : "Create Webhook"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
