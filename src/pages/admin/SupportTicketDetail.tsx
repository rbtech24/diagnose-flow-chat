
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { SupportTicketComponent, SupportTicket, SupportTicketStatus } from "@/components/support/SupportTicket";
import { mockTickets, currentUser } from "@/data/mockTickets";
import { ArrowLeft } from "lucide-react";

export default function AdminSupportTicketDetail() {
  const { ticketId } = useParams<{ ticketId: string }>();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState<SupportTicket | null>(null);

  useEffect(() => {
    // Load ticket data from mockTickets
    const foundTicket = mockTickets.find(t => t.id === ticketId);
    if (foundTicket) {
      setTicket(foundTicket);
    }
  }, [ticketId]);

  const handleUpdateStatus = (ticketId: string, status: SupportTicketStatus) => {
    if (ticket) {
      setTicket({
        ...ticket,
        status,
        updatedAt: new Date()
      });
    }
  };

  const handleAddMessage = (ticketId: string, content: string) => {
    if (ticket) {
      setTicket({
        ...ticket,
        messages: [
          ...ticket.messages,
          {
            id: `message-${Date.now()}`,
            ticketId,
            content,
            createdAt: new Date(),
            sender: currentUser
          }
        ],
        updatedAt: new Date()
      });
    }
  };

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
        <h1 className="text-3xl font-bold">Ticket #{ticketId}</h1>
      </div>

      <SupportTicketComponent
        ticket={ticket}
        onAddMessage={handleAddMessage}
        onUpdateStatus={handleUpdateStatus}
        isDetailView={true}
      />
    </div>
  );
}
