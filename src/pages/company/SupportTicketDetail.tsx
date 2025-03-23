
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { SupportTicketComponent, SupportTicket } from "@/components/support/SupportTicket";
import { placeholderUser } from "@/utils/placeholderData";
import { ArrowLeft } from "lucide-react";

export default function CompanySupportTicketDetail() {
  const { ticketId } = useParams<{ ticketId: string }>();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState<SupportTicket | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // This would be replaced with real API call
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      // In a real app, you would fetch from the server
      setTicket(null);
      setLoading(false);
    }, 500);
  }, [ticketId]);

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
            sender: placeholderUser
          }
        ],
        updatedAt: new Date()
      });
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center mb-6">
          <Button variant="ghost" onClick={() => navigate("/company/support")} className="mr-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Support
          </Button>
          <h1 className="text-3xl font-bold">Ticket Not Found</h1>
        </div>
        <div className="p-8 text-center border rounded-lg">
          <p className="text-gray-500">The requested ticket could not be found.</p>
          <Button onClick={() => navigate("/company/support")} className="mt-4">
            Return to Support Center
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center mb-6">
        <Button variant="ghost" onClick={() => navigate("/company/support")} className="mr-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Support
        </Button>
        <h1 className="text-3xl font-bold">Ticket #{ticketId}</h1>
      </div>

      <SupportTicketComponent
        ticket={ticket}
        onAddMessage={handleAddMessage}
        isDetailView={true}
      />
    </div>
  );
}
