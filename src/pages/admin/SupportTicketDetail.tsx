
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { SupportTicket } from "@/components/support/SupportTicket";
import { SupportTicket as SupportTicketType, SupportTicketStatus, SupportTicketMessage } from "@/types/support";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { fetchTicketById, fetchTicketMessages, updateTicketStatus, addTicketMessage } from "@/services/supportService";
import { handleApiError, withErrorHandling } from "@/utils/errorHandler";
import { toast } from "sonner";

export default function AdminSupportTicketDetail() {
  const { ticketId } = useParams<{ ticketId: string }>();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState<SupportTicketType | null>(null);
  const [messages, setMessages] = useState<SupportTicketMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast: uiToast } = useToast();

  useEffect(() => {
    if (ticketId) {
      fetchTicketDetails();
    }
  }, [ticketId]);

  const fetchTicketDetails = async () => {
    try {
      setLoading(true);
      
      if (!ticketId) {
        throw new Error("Ticket ID is missing");
      }
      
      // Use withErrorHandling to fetch ticket details
      const { data: ticketData, error: ticketError } = await withErrorHandling(
        async () => await fetchTicketById(ticketId),
        "fetching ticket details",
        false
      );
      
      if (ticketError) {
        setError(ticketError.message);
        return;
      }
      
      setTicket(ticketData);
      
      // Use withErrorHandling to fetch ticket messages
      const { data: messagesData, error: messagesError } = await withErrorHandling(
        async () => await fetchTicketMessages(ticketId),
        "fetching ticket messages",
        false
      );
      
      if (messagesError) {
        toast.error("Error loading messages", {
          description: messagesError.message
        });
      } else {
        setMessages(messagesData || []);
      }
      
    } catch (err) {
      const apiError = handleApiError(err, "loading ticket details", false);
      setError(apiError.message);
      
      toast.error("Error loading ticket", {
        description: "There was a problem retrieving the ticket details."
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (ticketId: string, status: SupportTicketStatus) => {
    const { data, error: apiError } = await withErrorHandling(
      async () => await updateTicketStatus(ticketId, status),
      "updating ticket status"
    );
    
    if (data) {
      // Update local state
      setTicket(prev => prev ? { ...prev, status, updated_at: new Date().toISOString() } : null);

      toast.success("Status updated", {
        description: `Ticket status changed to ${status}`
      });
    }
  };

  const handleAddMessage = async (ticketId: string, content: string) => {
    const { data, error: apiError } = await withErrorHandling(
      async () => await addTicketMessage(ticketId, content),
      "adding message"
    );
    
    if (data) {
      // Refresh all ticket data to get the latest messages with full sender details
      await fetchTicketDetails();
      
      toast.success("Message sent", {
        description: "Your message has been added to the ticket."
      });
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2">Loading ticket details...</span>
        </div>
      </div>
    );
  }

  if (error || !ticket) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center mb-6">
          <Button variant="ghost" onClick={() => navigate("/admin/support")} className="mr-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Support
          </Button>
          <h1 className="text-3xl font-bold">Ticket Not Found</h1>
        </div>
        <div className="p-8 text-center border rounded-lg">
          <p className="text-gray-500">{error || "The requested ticket could not be found."}</p>
          <Button onClick={() => navigate("/admin/support")} className="mt-4">
            Return to Support Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center mb-6">
        <Button variant="ghost" onClick={() => navigate("/admin/support")} className="mr-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Support
        </Button>
        <h1 className="text-3xl font-bold">Ticket #{ticketId?.substring(0, 8)}</h1>
      </div>

      <SupportTicket
        ticket={ticket}
        messages={messages}
        onAddMessage={handleAddMessage}
        onUpdateStatus={handleUpdateStatus}
        isDetailView={true}
      />
    </div>
  );
}
