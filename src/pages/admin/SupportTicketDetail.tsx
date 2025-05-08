
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { SupportTicket } from "@/components/support/SupportTicket";
import { SupportTicket as SupportTicketType, SupportTicketStatus, SupportTicketMessage } from "@/types/support";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { mockSupportTickets } from "@/data/mockSupportTickets";

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
      
      // Since we don't have a proper database table, use mock data
      const foundTicket = mockSupportTickets.find(ticket => ticket.id === ticketId);
      
      if (!foundTicket) {
        throw new Error("Ticket not found");
      }
      
      setTicket(foundTicket);
      
      // Mock messages
      const mockMessages: SupportTicketMessage[] = [
        {
          id: "msg1",
          ticket_id: ticketId || "",
          content: "I'm experiencing an issue with the technician assignment feature. When I try to assign a technician to a repair, the app freezes.",
          user_id: foundTicket.user_id,
          created_at: foundTicket.created_at,
          sender: {
            name: foundTicket.created_by_user?.name || "User",
            email: foundTicket.created_by_user?.email || "",
            avatar_url: foundTicket.created_by_user?.avatar_url,
            role: foundTicket.created_by_user?.role || "user"
          }
        },
        {
          id: "msg2",
          ticket_id: ticketId || "",
          content: "Thank you for reporting this. Could you please provide more details about when this happens? Does it occur with specific technicians or all of them?",
          user_id: "admin1",
          created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          sender: {
            name: "Support Team",
            email: "support@example.com",
            avatar_url: "",
            role: "admin"
          }
        }
      ];
      
      setMessages(mockMessages);
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
      // Update local state since we're using mock data
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
      // Create a mock message
      const newMessage: SupportTicketMessage = {
        id: `msg-${Date.now()}`,
        ticket_id: ticketId,
        content,
        user_id: "admin-user",
        created_at: new Date().toISOString(),
        sender: {
          name: "Admin User",
          email: "admin@example.com",
          role: "admin"
        }
      };
      
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
