
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SupportTicket as SupportTicketType, SupportTicketMessage, SupportTicketStatus } from "@/types/support";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from "date-fns";

export interface SupportTicketProps {
  ticket: SupportTicketType;
  messages?: SupportTicketMessage[];
  onAddMessage?: (ticketId: string, content: string) => Promise<void>;
  onUpdateStatus?: (ticketId: string, status: SupportTicketStatus) => Promise<void>;
  isDetailView?: boolean;
}

export const SupportTicket: React.FC<SupportTicketProps> = ({
  ticket,
  messages = [],
  onAddMessage,
  onUpdateStatus,
  isDetailView = false,
}) => {
  const [newMessage, setNewMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !onAddMessage) return;
    
    setIsSubmitting(true);
    try {
      await onAddMessage(ticket.id, newMessage);
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStatusChange = async (status: string) => {
    if (!onUpdateStatus) return;
    
    setIsUpdatingStatus(true);
    try {
      await onUpdateStatus(ticket.id, status as SupportTicketStatus);
    } catch (error) {
      console.error("Error updating status:", error);
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      return format(new Date(dateStr), "MMM d, yyyy 'at' h:mm a");
    } catch (error) {
      return dateStr;
    }
  };

  const getInitials = (name: string) => {
    if (!name) return "??";
    return name
      .split(" ")
      .map(part => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  const renderPriorityBadge = (priority: string) => {
    switch (priority) {
      case "critical":
        return <Badge variant="destructive">Critical</Badge>;
      case "high":
        return <Badge className="bg-orange-500">High</Badge>;
      case "medium":
        return <Badge variant="secondary">Medium</Badge>;
      case "low":
        return <Badge variant="outline">Low</Badge>;
      default:
        return <Badge variant="outline">{priority}</Badge>;
    }
  };

  const renderStatusBadge = (status: string) => {
    switch (status) {
      case "open":
        return <Badge variant="outline">Open</Badge>;
      case "in-progress":
        return <Badge className="bg-blue-500">In Progress</Badge>;
      case "resolved":
        return <Badge className="bg-green-500">Resolved</Badge>;
      case "closed":
        return <Badge variant="secondary">Closed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3 justify-between items-center">
        <div className="flex flex-wrap gap-2 items-center">
          {renderPriorityBadge(ticket.priority)}
          {renderStatusBadge(ticket.status)}
          <span className="text-sm text-muted-foreground">
            Created {formatDate(ticket.created_at)}
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          {onUpdateStatus && (
            <Select
              value={ticket.status}
              onValueChange={handleStatusChange}
              disabled={isUpdatingStatus || ticket.status === "closed"}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Update Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>
          )}
        </div>
      </div>

      <Card className="mt-4">
        <CardHeader>
          <CardTitle className="text-lg">{ticket.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Initial ticket description */}
            <div className="flex gap-4">
              <Avatar className="h-10 w-10">
                <AvatarImage src={ticket.creator?.avatar_url} alt={ticket.creator?.name || "User"} />
                <AvatarFallback className="bg-primary/10 text-primary">
                  {getInitials(ticket.creator?.name || "User")}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-medium">{ticket.creator?.name || "User"}</span>
                    <span className="text-muted-foreground text-sm ml-2">
                      {formatDate(ticket.created_at)}
                    </span>
                  </div>
                </div>
                <div className="mt-2 text-sm">
                  {ticket.description}
                </div>
              </div>
            </div>

            {/* Message thread - only shown in detail view or if messages exist */}
            {(isDetailView || messages.length > 0) && messages.map((message) => (
              <div key={message.id} className="flex gap-4">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={message.sender?.avatar_url} alt={message.sender?.name || "User"} />
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {getInitials(message.sender?.name || "User")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-medium">{message.sender?.name || "User"}</span>
                      <span className="text-muted-foreground text-sm ml-2">
                        {formatDate(message.created_at)}
                      </span>
                    </div>
                  </div>
                  <div className="mt-2 text-sm">
                    {message.content}
                  </div>
                </div>
              </div>
            ))}

            {/* Reply input - only shown if onAddMessage is provided and ticket is not closed */}
            {onAddMessage && ticket.status !== "closed" && (
              <div className="pt-4 border-t">
                <Textarea
                  placeholder="Type your reply..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="mb-2 min-h-[100px]"
                />
                <div className="flex justify-end">
                  <Button 
                    onClick={handleSendMessage}
                    disabled={isSubmitting || !newMessage.trim()}
                  >
                    {isSubmitting ? "Sending..." : "Send Reply"}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Alias export to match the import name in other files
export const SupportTicketComponent = SupportTicket;
