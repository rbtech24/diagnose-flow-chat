
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSupportTickets } from "@/hooks/useSupportTickets";
import { SupportTicket } from "@/components/support/SupportTicket";
import { NewTicketForm } from "@/components/support/NewTicketForm";
import { useUserManagementStore } from "@/store/userManagementStore";
import { toast } from "sonner";

export default function Support() {
  const [isNewTicketOpen, setIsNewTicketOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("open");
  
  // Get the current tech user for the company ID
  const { users } = useUserManagementStore();
  const currentUser = users.find(user => user.role === 'tech') || users[0];
  const companyId = currentUser?.companyId;
  
  // Use the support tickets hook with the company ID
  const { 
    tickets, 
    isLoading, 
    error, 
    loadTickets, 
    createTicket, 
    updateTicket, 
    addMessage 
  } = useSupportTickets(activeTab, companyId);
  
  const filteredTickets = tickets.filter(ticket => 
    ticket.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    ticket.description.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const handleCreateTicket = async (ticketData: any) => {
    try {
      await createTicket({
        ...ticketData,
        user_id: currentUser?.id,
        company_id: companyId
      });
      toast.success("Support ticket created successfully");
      setIsNewTicketOpen(false);
    } catch (error) {
      toast.error("Failed to create ticket");
      console.error(error);
    }
  };
  
  const handleUpdateTicket = async (ticketId: string, updateData: any) => {
    try {
      await updateTicket(ticketId, updateData);
      toast.success("Ticket updated successfully");
    } catch (error) {
      toast.error("Failed to update ticket");
      console.error(error);
    }
  };
  
  const handleAddMessage = async (ticketId: string, content: string) => {
    try {
      await addMessage({
        content,
        ticket_id: ticketId
      });
      toast.success("Message added successfully");
    } catch (error) {
      toast.error("Failed to add message");
      console.error(error);
    }
  };
  
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    loadTickets(value);
  };
  
  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Support</h1>
        <Button onClick={() => setIsNewTicketOpen(true)}>New Ticket</Button>
      </div>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Support Tickets</CardTitle>
          <CardDescription>
            View and manage your support requests
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-4">
            <Input
              placeholder="Search tickets..."
              className="max-w-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Tabs value={activeTab} onValueChange={handleTabChange}>
              <TabsList>
                <TabsTrigger value="open">Open</TabsTrigger>
                <TabsTrigger value="resolved">Resolved</TabsTrigger>
                <TabsTrigger value="closed">Closed</TabsTrigger>
                <TabsTrigger value="all">All</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          
          <div className="space-y-4">
            {isLoading ? (
              <div className="text-center py-8">Loading tickets...</div>
            ) : error ? (
              <div className="text-center py-8 text-red-500">
                {error.message || "Failed to load tickets"}
              </div>
            ) : filteredTickets.length === 0 ? (
              <div className="text-center py-8">
                {searchQuery ? "No tickets match your search" : "No tickets found"}
              </div>
            ) : (
              filteredTickets.map(ticket => (
                <SupportTicket 
                  key={ticket.id}
                  ticket={ticket} 
                  onUpdate={(data) => handleUpdateTicket(ticket.id, data)} 
                  onAddMessage={(content) => handleAddMessage(ticket.id, content)} 
                />
              ))
            )}
          </div>
        </CardContent>
      </Card>
      
      {isNewTicketOpen && (
        <NewTicketForm 
          onSubmit={handleCreateTicket} 
          onCancel={() => setIsNewTicketOpen(false)} 
        />
      )}
    </div>
  );
}
