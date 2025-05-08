import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SupportTicket, SupportTicketProps } from "@/components/support/SupportTicket";
import { Button } from "@/components/ui/button";
import { Search, Filter, RotateCw, AlertCircle } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { SupportTicket as SupportTicketType, SupportTicketStatus } from "@/types/support";
import { Card, CardContent } from "@/components/ui/card";
import { fetchSupportTickets, updateSupportTicket, addTicketMessage } from "@/api/supportTicketsApi";

export default function AdminSupport() {
  const [tickets, setTickets] = useState<SupportTicketType[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      
      // Fetch real data from the API
      const data = await fetchSupportTickets();
      setTickets(data);
      setError(null);
    } catch (err) {
      console.error("Error fetching tickets:", err);
      setError("Failed to load support tickets");
      toast({
        variant: "destructive",
        title: "Error loading tickets",
        description: "There was a problem fetching the support tickets."
      });

      // Fallback to empty array
      setTickets([]);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (ticketId: string, status: SupportTicketStatus) => {
    try {
      // Update the ticket in the database
      const updatedTicket = await updateSupportTicket(ticketId, { status });
      
      // Update the local state
      setTickets(tickets.map(ticket => 
        ticket.id === ticketId 
          ? { ...ticket, status, updated_at: new Date().toISOString() } 
          : ticket
      ));

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
      await addTicketMessage({ ticket_id: ticketId, content });
      
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

  const openTickets = filteredTickets.filter((ticket) => ticket.status === "open");
  const inProgressTickets = filteredTickets.filter((ticket) => ticket.status === "in_progress");
  const resolvedTickets = filteredTickets.filter((ticket) => ticket.status === "resolved");
  const closedTickets = filteredTickets.filter((ticket) => ticket.status === "closed");

  const viewTicketDetails = (ticketId: string) => {
    navigate(`/admin/support/${ticketId}`);
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Support Dashboard</h1>
          <p className="text-gray-500">Manage support tickets from companies and technicians</p>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={fetchTickets}
            disabled={loading}
          >
            <RotateCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
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
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {error && (
        <Card className="mb-6 bg-destructive/10">
          <CardContent className="p-4 flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-destructive" />
            <span>{error}</span>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="open" className="space-y-4">
        <TabsList>
          <TabsTrigger value="open">
            Open <span className="ml-1 rounded-full bg-blue-100 px-2 py-0.5 text-xs text-blue-600">{openTickets.length}</span>
          </TabsTrigger>
          <TabsTrigger value="in-progress">
            In Progress <span className="ml-1 rounded-full bg-yellow-100 px-2 py-0.5 text-xs text-yellow-600">{inProgressTickets.length}</span>
          </TabsTrigger>
          <TabsTrigger value="resolved">
            Resolved <span className="ml-1 rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-600">{resolvedTickets.length}</span>
          </TabsTrigger>
          <TabsTrigger value="closed">
            Closed <span className="ml-1 rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600">{closedTickets.length}</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="open" className="space-y-4">
          {loading ? (
            <div className="p-8 text-center border rounded-lg">
              <p className="text-gray-500">Loading tickets...</p>
            </div>
          ) : openTickets.length > 0 ? (
            openTickets.map((ticket) => (
              <div key={ticket.id} onClick={() => viewTicketDetails(ticket.id)} className="cursor-pointer">
                <SupportTicket
                  ticket={ticket}
                  onAddMessage={handleAddMessage}
                  onUpdateStatus={handleUpdateStatus}
                />
              </div>
            ))
          ) : (
            <div className="p-8 text-center border rounded-lg">
              <p className="text-gray-500">No open tickets</p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="in-progress" className="space-y-4">
          {loading ? (
            <div className="p-8 text-center border rounded-lg">
              <p className="text-gray-500">Loading tickets...</p>
            </div>
          ) : inProgressTickets.length > 0 ? (
            inProgressTickets.map((ticket) => (
              <div key={ticket.id} onClick={() => viewTicketDetails(ticket.id)} className="cursor-pointer">
                <SupportTicket
                  ticket={ticket}
                  onAddMessage={handleAddMessage}
                  onUpdateStatus={handleUpdateStatus}
                />
              </div>
            ))
          ) : (
            <div className="p-8 text-center border rounded-lg">
              <p className="text-gray-500">No in-progress tickets</p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="resolved" className="space-y-4">
          {loading ? (
            <div className="p-8 text-center border rounded-lg">
              <p className="text-gray-500">Loading tickets...</p>
            </div>
          ) : resolvedTickets.length > 0 ? (
            resolvedTickets.map((ticket) => (
              <div key={ticket.id} onClick={() => viewTicketDetails(ticket.id)} className="cursor-pointer">
                <SupportTicket
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
          {loading ? (
            <div className="p-8 text-center border rounded-lg">
              <p className="text-gray-500">Loading tickets...</p>
            </div>
          ) : closedTickets.length > 0 ? (
            closedTickets.map((ticket) => (
              <div key={ticket.id} onClick={() => viewTicketDetails(ticket.id)} className="cursor-pointer">
                <SupportTicket
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
