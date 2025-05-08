
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TicketPriority } from "@/types/support";
import { AlertCircle, Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { createSupportTicket } from "@/services/supportService";
import { useToast } from "@/components/ui/use-toast";

interface NewTicketFormProps {
  onSubmit: (title: string, description: string, priority: TicketPriority) => void;
  isSubmitting?: boolean;
  error?: string;
}

export function NewTicketForm({ onSubmit, isSubmitting = false, error }: NewTicketFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<TicketPriority>("medium");
  const { toast } = useToast();
  const [localIsSubmitting, setLocalIsSubmitting] = useState(false);
  const [localError, setLocalError] = useState<string | undefined>(undefined);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim() && description.trim()) {
      try {
        setLocalIsSubmitting(true);
        setLocalError(undefined);
        
        await createSupportTicket(title, description, priority);
        
        toast({
          title: "Ticket created",
          description: "Your support ticket has been submitted successfully."
        });
        
        // Clear form
        setTitle("");
        setDescription("");
        setPriority("medium");
        
        // Call parent handler
        onSubmit(title, description, priority);
      } catch (error) {
        console.error('Error creating ticket:', error);
        setLocalError("Failed to create ticket. Please try again.");
        
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to create your ticket. Please try again."
        });
      } finally {
        setLocalIsSubmitting(false);
      }
    }
  };

  const effectiveIsSubmitting = isSubmitting || localIsSubmitting;
  const effectiveError = error || localError;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Support Ticket</CardTitle>
        <CardDescription>
          Describe the issue you're experiencing. Our support team will respond as soon as possible.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {effectiveError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{effectiveError}</AlertDescription>
            </Alert>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="Brief summary of the issue"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="priority">Priority</Label>
            <Select 
              value={priority} 
              onValueChange={(value) => setPriority(value as TicketPriority)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Please provide detailed information about your issue"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={5}
              required
            />
          </div>
          
          <Button 
            type="submit" 
            className="w-full" 
            disabled={effectiveIsSubmitting || !title.trim() || !description.trim()}
          >
            {effectiveIsSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              "Submit Ticket"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
