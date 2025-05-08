
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Send } from "lucide-react";
import { SupportTicket, SupportTicketMessage } from "@/types/support";
import { mockSupportTickets } from "@/data/mockSupportTickets";
import { currentUser } from "@/data/mockTickets";

export default function TechSupportTicketDetail() {
  const [ticket, setTicket] = useState<SupportTicket | null>(null);
  const [messages, setMessages] = useState<SupportTicketMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    // Simulate API call to fetch ticket details
    setTimeout(() => {
      if (id) {
        const foundTicket = mockSupportTickets.find(t => t.id === id);
        
        if (foundTicket) {
          setTicket(foundTicket);
          
          // Mock messages
          const mockMessages: SupportTicketMessage[] = [
            {
              id: "msg1",
              ticket_id: id,
              content: "I'm experiencing an issue with the technician assignment feature. When I try to assign a technician to a repair, the app freezes.",
              user_id: foundTicket.user_id,
              created_at: foundTicket.created_at,
              sender: foundTicket.created_by_user
            },
            {
              id: "msg2",
              ticket_id: id,
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
        }
      }
      
      setLoading(false);
    }, 800);
  }, [id]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newMessage.trim() || !ticket) return;
    
    // Add new message
    const newMessageObj: SupportTicketMessage = {
      id: `msg-${Date.now()}`,
      ticket_id: ticket.id,
      content: newMessage.trim(),
      user_id: currentUser.id,
      created_at: new Date().toISOString(),
      sender: {
        name: currentUser.name,
        email: currentUser.email,
        avatar_url: currentUser.avatar_url,
        role: currentUser.role
      }
    };
    
    setMessages([...messages, newMessageObj]);
    setNewMessage("");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open": return "bg-blue-100 text-blue-800";
      case "in_progress": return "bg-yellow-100 text-yellow-800";
      case "resolved": return "bg-green-100 text-green-800";
      case "closed": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "low": return "bg-gray-100 text-gray-800";
      case "medium": return "bg-blue-100 text-blue-800";
      case "high": return "bg-orange-100 text-orange-800";
      case "critical": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-10 bg-gray-200 rounded w-1/4"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-40 bg-gray-200 rounded"></div>
          <div className="h-20 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center py-10">
          <h2 className="text-2xl font-bold mb-2">Ticket Not Found</h2>
          <p className="text-gray-500 mb-4">The support ticket you're looking for doesn't exist.</p>
          <Button onClick={() => navigate("/tech/support")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Support Tickets
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <Button variant="ghost" onClick={() => navigate("/tech/support")} className="mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Support Tickets
      </Button>

      <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">{ticket.title}</h1>
          <div className="flex flex-wrap gap-2 items-center text-sm text-muted-foreground">
            <span>Ticket #{ticket.id.slice(0, 8)}</span>
            <span>•</span>
            <span>Opened {new Date(ticket.created_at).toLocaleDateString()}</span>
            <span>•</span>
            <span>By {ticket.created_by_user?.name || "Unknown"}</span>
          </div>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Badge className={getStatusColor(ticket.status)}>
            {ticket.status.replace("_", " ")}
          </Badge>
          <Badge className={getPriorityColor(ticket.priority)}>
            {ticket.priority}
          </Badge>
        </div>
      </div>

      <div className="space-y-6 mb-6">
        <div className="border rounded-lg p-4">
          <h2 className="font-medium mb-2">Description</h2>
          <p className="whitespace-pre-wrap">{ticket.description}</p>
        </div>
      </div>

      <div className="border-t pt-6 mb-6">
        <h2 className="font-medium mb-4">Conversation</h2>
        <div className="space-y-6 mb-6">
          {messages.length > 0 ? (
            messages.map((message) => (
              <div key={message.id} className="flex gap-4">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={message.sender?.avatar_url} alt={message.sender?.name || "User"} />
                  <AvatarFallback>
                    {message.sender?.name?.substring(0, 2).toUpperCase() || "??"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{message.sender?.name || "Unknown User"}</span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(message.created_at).toLocaleString()}
                    </span>
                  </div>
                  <div className="mt-1 whitespace-pre-wrap">{message.content}</div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-muted-foreground py-4">No messages yet</p>
          )}
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Textarea
            placeholder="Type your reply..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            rows={4}
            className="resize-none"
          />
          <div className="flex justify-end">
            <Button type="submit" disabled={!newMessage.trim()}>
              <Send className="mr-2 h-4 w-4" />
              Send Reply
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
