
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { SupportTicket } from "@/types/support";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { CreateTicketButton } from "@/components/support/CreateTicketButton";
import { useSupportTickets } from "@/hooks/useSupportTickets";

export default function CompanySupport() {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  
  // Use the hook with company filtering
  const { tickets, isLoading, error } = useSupportTickets(undefined, 'company');

  const filteredTickets = tickets.filter(ticket => 
    ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    ticket.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Support Tickets</h1>
          <p className="text-muted-foreground">View and manage company support requests</p>
        </div>
        <div>
          <CreateTicketButton />
        </div>
      </div>

      <div className="mb-6">
        <Input
          placeholder="Search tickets..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-md"
        />
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="border rounded-lg p-6 animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            </div>
          ))}
        </div>
      ) : filteredTickets.length > 0 ? (
        <div className="space-y-4">
          {filteredTickets.map((ticket) => (
            <div 
              key={ticket.id} 
              className="border rounded-lg p-6 hover:border-primary/50 transition-colors cursor-pointer"
              onClick={() => navigate(`/company/support/${ticket.id}`)}
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    {ticket.created_by_user && (
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={ticket.created_by_user.avatar_url} alt={ticket.created_by_user.name} />
                        <AvatarFallback>{ticket.created_by_user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                    )}
                    <span className="text-sm text-muted-foreground">
                      {ticket.created_by_user?.name || "Unknown user"} • {new Date(ticket.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <h3 className="font-medium text-lg">{ticket.title}</h3>
                </div>
                <div className="flex gap-2">
                  <Badge className={getStatusColor(ticket.status)}>
                    {ticket.status.replace("_", " ")}
                  </Badge>
                  <Badge className={getPriorityColor(ticket.priority)}>
                    {ticket.priority}
                  </Badge>
                </div>
              </div>
              <p className="text-muted-foreground line-clamp-2 mb-2">
                {ticket.description}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 border rounded-lg">
          <h3 className="text-lg font-medium mb-2">No tickets found</h3>
          <p className="text-muted-foreground mb-4">Try adjusting your search criteria</p>
          <CreateTicketButton buttonText="Create New Ticket" />
        </div>
      )}
    </div>
  );
}
