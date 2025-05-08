
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { SupportTicket } from "@/components/support/SupportTicket";
import { SupportTicket as SupportTicketType, SupportTicketStatus, SupportTicketMessage } from "@/types/support";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { fetchSupportTicketById, updateSupportTicket, fetchTicketMessages, addTicketMessage } from "@/api/supportTicketsApi";

export default function AdminSupportTicketDetail() {
  const { ticketId } = useParams<{ ticketId: string }>();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState<SupportTicketType | null>(null);
  const [messages, setMessages] = useState<SupportTicketMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (ticketId) {
      fetchTicketDetails();
    }
  }, [ticketId]);

  const fetchTicketDetails = async () => {
    try {
      setLoading(true);
      
      if (!ticketId) {
        throw new Error("Ticket ID not provided");
      }
      
      // Fetch the ticket details
      const ticketData = await fetchSupportTicketById(ticketId);
      setTicket(ticketData);
      
      // Fetch messages for the ticket
      const messagesData = await fetchTicketMessages(ticketId);
      setMessages(messagesData);
      
    } catch (err) {
      console.error("Error fetching ticket details:", err);
      toast({
        variant: "destructive",
        title: "Error loading ticket",
        description: "There was a problem retrieving the ticket details."
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (ticketId: string, status: SupportTicketStatus) => {
    try {
      // Update the ticket in the database
      const updatedTicket = await updateSupportTicket(ticketId, { status });
      
      // Update local state
      setTicket(prev => prev ? { ...prev, status, updated_at: new Date().toISOString() } : null);

      toast({
        title: "Status updated",
        description: `Ticket status changed to ${status}`,
      });
    } catch (err) {
      console.error("Error updating ticket status:", err);
      toast({
        variant: "destructive",
        title: "Update failed",
        description: "Failed to update ticket status."
      });
    }
  };

  const handleAddMessage = async (ticketId: string, content: string) => {
    try {
      // Add the message to the database
      const newMessage = await addTicketMessage({ ticket_id: ticketId, content });
      
      // Update local state
      setMessages(prev => [...prev, newMessage]);

      toast({
        title: "Message sent",
        description: "Your message has been added to the ticket."
      });
    } catch (err) {
      console.error("Error adding message:", err);
      toast({
        variant: "destructive",
        title: "Failed to send message",
        description: "There was a problem adding your message."
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

  if (!ticket) {
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
          <p className="text-gray-500">The requested ticket could not be found.</p>
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
