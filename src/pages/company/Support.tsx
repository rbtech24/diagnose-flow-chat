
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSupportTickets } from "@/hooks/useSupportTickets";

export function CompanySupport() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showNewTicket, setShowNewTicket] = useState(false);
  const { tickets, isLoading } = useSupportTickets();
  const navigate = useNavigate();

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
          <h1 className="text-3xl font-bold">Support</h1>
          <p className="text-muted-foreground">Get help with your technical issues</p>
        </div>
        <div>
          <Button onClick={() => setShowNewTicket(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Create Ticket
          </Button>
        </div>
      </div>

      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search tickets..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
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
          <p className="text-muted-foreground mb-4">Try adjusting your search or create a new support ticket</p>
          <Button onClick={() => setShowNewTicket(true)}>Create New Ticket</Button>
        </div>
      )}

      <Dialog open={showNewTicket} onOpenChange={setShowNewTicket}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Create Support Ticket</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            {/* Form will be implemented using the NewTicketForm component */}
            <p className="text-center text-muted-foreground">
              Support ticket form goes here
            </p>
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={() => setShowNewTicket(false)}>Cancel</Button>
              <Button onClick={() => setShowNewTicket(false)}>Submit</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
