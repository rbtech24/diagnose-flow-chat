
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { NewTicketForm } from "@/components/support/NewTicketForm";
import { useSupportTickets } from "@/hooks/useSupportTickets";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { PlusCircle } from "lucide-react";

interface CreateTicketButtonProps {
  variant?: "default" | "outline" | "secondary";
  navigateAfterCreate?: boolean;
  buttonText?: string;
  size?: "default" | "sm" | "lg" | "icon";
}

export function CreateTicketButton({
  variant = "default",
  navigateAfterCreate = true,
  buttonText = "Create Ticket",
  size = "default"
}: CreateTicketButtonProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);
  const { createTicket } = useSupportTickets();
  const navigate = useNavigate();

  const handleSubmit = async (title: string, description: string, priority: any) => {
    setIsSubmitting(true);
    setError(undefined);
    
    try {
      // Call the API to create a support ticket
      const newTicket = await createTicket({
        title,
        description,
        priority
      });
      
      toast.success("Support ticket submitted successfully!", {
        description: "Our team will respond to your inquiry as soon as possible."
      });
      
      setIsDialogOpen(false);
      
      // Navigate to the newly created ticket if requested
      if (navigateAfterCreate && newTicket?.id) {
        // Determine the correct route based on the URL
        const path = window.location.pathname;
        const basePath = path.includes('/tech/') ? '/tech/support/' : 
                        path.includes('/company/') ? '/company/support/' : 
                        '/help-center/tickets/';
        
        navigate(`${basePath}${newTicket.id}`);
      }
    } catch (error: any) {
      console.error("Error creating ticket:", error);
      setError(error.message || "Failed to create support ticket. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Button 
        onClick={() => setIsDialogOpen(true)} 
        variant={variant} 
        size={size}
      >
        <PlusCircle className="mr-2 h-4 w-4" />
        {buttonText}
      </Button>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Create Support Ticket</DialogTitle>
          </DialogHeader>
          <NewTicketForm
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            error={error}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
