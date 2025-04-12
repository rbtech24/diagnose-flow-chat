import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  SupportTicketComponent, 
  SupportTicket as ComponentSupportTicket, 
  SupportTicketStatus 
} from "@/components/support/SupportTicket";
import { Button } from "@/components/ui/button";
import { Plus, Search, Filter, RotateCw } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { emptyTickets, placeholderUser } from "@/utils/placeholderData";
import { NewTicketForm } from "@/components/support/NewTicketForm";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useNavigate } from "react-router-dom";
import { SupportTicket } from "@/types/support-ticket";

export default function AdminSupport() {
  const [tickets, setTickets] = useState<ComponentSupportTicket[]>(() => 
    // Convert any ticket data to the correct format expected by the component
    emptyTickets.map(ticket => ({
      ...ticket,
      createdAt: new Date(ticket.createdAt),
      updatedAt: new Date(ticket.updatedAt),
      messages: ticket.messages || []
    }))
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const navigate = useNavigate();

  const handleAddMessage = (ticketId: string, content: string) => {
    setTickets(
      tickets.map((ticket) => 
        ticket.id === ticketId 
          ? { 
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
            } 
          : ticket
      )
    );
  };

  const handleUpdateStatus = (ticketId: string, status: SupportTicketStatus) => {
    setTickets(
      tickets.map((ticket) => 
        ticket.id === ticketId 
          ? { ...ticket, status, updatedAt: new Date() } 
          : ticket
      )
    );
  };

  const handleCreateTicket = (title: string, description: string, priority: any) => {
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      const newTicket: SupportTicket = {
        id: `ticket-${Date.now()}`,
        title,
        description,
        status: "open",
        priority,
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: placeholderUser,
        messages: []
      };
      
      setTickets([newTicket, ...tickets]);
      setIsSubmitting(false);
      setIsDialogOpen(false);
    }, 1000);
  };

  const filteredTickets = tickets.filter((ticket) => {
    const matchesSearch = 
      searchQuery === "" || 
      ticket.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      ticket.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = 
      statusFilter === "all" || 
      ticket.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const activeTickets = filteredTickets.filter((ticket) => 
    ["open", "in-progress"].includes(ticket.status)
  );
  
  const resolvedTickets = filteredTickets.filter((ticket) => 
    ticket.status === "resolved"
  );
  
  const closedTickets = filteredTickets.filter((ticket) => 
    ticket.status === "closed"
  );

  const viewTicketDetails = (ticketId: string) => {
    navigate(`/admin/support/${ticketId}`);
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Support Tickets</h1>
          <p className="text-gray-500">Manage support requests</p>
        </div>
        <div className="flex items-center gap-2">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Ticket
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <NewTicketForm
                onSubmit={handleCreateTicket}
                isSubmitting={isSubmitting}
              />
            </DialogContent>
          </Dialog>
          
          <Button variant="ghost" size="icon">
            <RotateCw className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search tickets..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="w-full sm:w-48">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger>
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Tickets</SelectItem>
              <SelectItem value="open">Open</SelectItem>
              <SelectItem value="in-progress">In Progress</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs defaultValue="active" className="space-y-4">
        <TabsList>
          <TabsTrigger value="active">
            Active <span className="ml-1 rounded-full bg-blue-100 px-2 py-0.5 text-xs text-blue-600">{activeTickets.length}</span>
          </TabsTrigger>
          <TabsTrigger value="resolved">
            Resolved <span className="ml-1 rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-600">{resolvedTickets.length}</span>
          </TabsTrigger>
          <TabsTrigger value="closed">
            Closed <span className="ml-1 rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600">{closedTickets.length}</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="active" className="space-y-4">
          {activeTickets.length > 0 ? (
            activeTickets.map((ticket) => (
              <div key={ticket.id} onClick={() => viewTicketDetails(ticket.id)} className="cursor-pointer">
                <SupportTicketComponent
                  ticket={ticket}
                  onAddMessage={handleAddMessage}
                  onUpdateStatus={handleUpdateStatus}
                />
              </div>
            ))
          ) : (
            <div className="p-8 text-center border rounded-lg">
              <p className="text-gray-500">No active tickets</p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="resolved" className="space-y-4">
          {resolvedTickets.length > 0 ? (
            resolvedTickets.map((ticket) => (
              <div key={ticket.id} onClick={() => viewTicketDetails(ticket.id)} className="cursor-pointer">
                <SupportTicketComponent
                  ticket={ticket}
                  onAddMessage={handleAddMessage}
                  onUpdateStatus={handleUpdateStatus}
                />
              </div>
            ))
          ) : (
            <div className="p-8 text-center border rounded-lg">
              <p className="text-gray-500">No resolved tickets</p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="closed" className="space-y-4">
          {closedTickets.length > 0 ? (
            closedTickets.map((ticket) => (
              <div key={ticket.id} onClick={() => viewTicketDetails(ticket.id)} className="cursor-pointer">
                <SupportTicketComponent
                  ticket={ticket}
                  onAddMessage={handleAddMessage}
                  onUpdateStatus={handleUpdateStatus}
                />
              </div>
            ))
          ) : (
            <div className="p-8 text-center border rounded-lg">
              <p className="text-gray-500">No closed tickets</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
