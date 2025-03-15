
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SupportTicketComponent, SupportTicket, SupportTicketStatus } from "@/components/support/SupportTicket";
import { Button } from "@/components/ui/button";
import { Search, Filter, RotateCw } from "lucide-react";
import { mockTickets, currentUser } from "@/data/mockTickets";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Link, useNavigate } from "react-router-dom";

export default function AdminSupport() {
  const [tickets, setTickets] = useState<SupportTicket[]>(mockTickets);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const navigate = useNavigate();

  const handleUpdateStatus = (ticketId: string, status: SupportTicketStatus) => {
    setTickets(
      tickets.map((ticket) => 
        ticket.id === ticketId 
          ? { 
              ...ticket, 
              status, 
              updatedAt: new Date() 
            } 
          : ticket
      )
    );
  };

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
                  sender: currentUser
                }
              ],
              updatedAt: new Date()
            } 
          : ticket
      )
    );
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
  const inProgressTickets = filteredTickets.filter((ticket) => ticket.status === "in-progress");
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
          {openTickets.length > 0 ? (
            openTickets.map((ticket) => (
              <div key={ticket.id} onClick={() => viewTicketDetails(ticket.id)} className="cursor-pointer">
                <SupportTicketComponent
                  ticket={ticket}
                  onAddMessage={handleAddMessage}
                  onUpdateStatus={handleUpdateStatus}
                  canUpdateStatus={true}
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
          {inProgressTickets.length > 0 ? (
            inProgressTickets.map((ticket) => (
              <div key={ticket.id} onClick={() => viewTicketDetails(ticket.id)} className="cursor-pointer">
                <SupportTicketComponent
                  ticket={ticket}
                  onAddMessage={handleAddMessage}
                  onUpdateStatus={handleUpdateStatus}
                  canUpdateStatus={true}
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
          {resolvedTickets.length > 0 ? (
            resolvedTickets.map((ticket) => (
              <div key={ticket.id} onClick={() => viewTicketDetails(ticket.id)} className="cursor-pointer">
                <SupportTicketComponent
                  ticket={ticket}
                  onAddMessage={handleAddMessage}
                  onUpdateStatus={handleUpdateStatus}
                  canUpdateStatus={true}
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
                  canUpdateStatus={true}
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
