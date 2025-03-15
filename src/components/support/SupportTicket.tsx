
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Clock, MessageCircle, CheckCircle, XCircle } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export type TicketStatus = "open" | "in-progress" | "resolved" | "closed";
export type TicketPriority = "low" | "medium" | "high" | "urgent";

export interface TicketMessage {
  id: string;
  ticketId: string;
  content: string;
  createdAt: Date;
  sender: {
    id: string;
    name: string;
    role: string;
    avatarUrl?: string;
  };
}

export interface SupportTicket {
  id: string;
  title: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  createdAt: Date;
  updatedAt: Date;
  createdBy: {
    id: string;
    name: string;
    role: string;
    avatarUrl?: string;
  };
  assignedTo?: {
    id: string;
    name: string;
    role: string;
    avatarUrl?: string;
  };
  messages: TicketMessage[];
}

interface SupportTicketProps {
  ticket: SupportTicket;
  onAddMessage?: (ticketId: string, content: string) => void;
  onUpdateStatus?: (ticketId: string, status: TicketStatus) => void;
  canUpdateStatus?: boolean;
  isDetailView?: boolean;
}

export function SupportTicketComponent({
  ticket,
  onAddMessage,
  onUpdateStatus,
  canUpdateStatus = false,
  isDetailView = false
}: SupportTicketProps) {
  const [newMessage, setNewMessage] = useState("");

  const getStatusColor = (status: TicketStatus) => {
    switch (status) {
      case "open":
        return "bg-blue-500";
      case "in-progress":
        return "bg-yellow-500";
      case "resolved":
        return "bg-green-500";
      case "closed":
        return "bg-gray-500";
      default:
        return "bg-gray-500";
    }
  };

  const getPriorityColor = (priority: TicketPriority) => {
    switch (priority) {
      case "low":
        return "bg-gray-500";
      case "medium":
        return "bg-blue-500";
      case "high":
        return "bg-orange-500";
      case "urgent":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const handleSubmitMessage = () => {
    if (newMessage.trim() && onAddMessage) {
      onAddMessage(ticket.id, newMessage);
      setNewMessage("");
    }
  };

  const handleStatusChange = (status: TicketStatus) => {
    if (onUpdateStatus) {
      onUpdateStatus(ticket.id, status);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map(n => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <Card className="w-full mb-4">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl">{ticket.title}</CardTitle>
            <CardDescription className="flex items-center mt-1">
              <Clock className="h-4 w-4 mr-1 inline" />
              Opened {formatDate(ticket.createdAt)} by {ticket.createdBy.name}
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Badge className={getPriorityColor(ticket.priority)}>
              {ticket.priority.charAt(0).toUpperCase() + ticket.priority.slice(1)}
            </Badge>
            <Badge className={getStatusColor(ticket.status)}>
              {ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {!isDetailView ? (
          <p className="text-gray-700">{ticket.description}</p>
        ) : (
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-700">{ticket.description}</p>
              <div className="flex items-center mt-2 text-sm text-gray-500">
                <Avatar className="h-6 w-6 mr-2">
                  <AvatarImage src={ticket.createdBy.avatarUrl} />
                  <AvatarFallback>{getInitials(ticket.createdBy.name)}</AvatarFallback>
                </Avatar>
                {ticket.createdBy.name} • {formatDate(ticket.createdAt)}
              </div>
            </div>
            
            {ticket.messages.map((message) => (
              <div key={message.id} className="p-4 bg-gray-50 rounded-lg">
                <p className="text-gray-700">{message.content}</p>
                <div className="flex items-center mt-2 text-sm text-gray-500">
                  <Avatar className="h-6 w-6 mr-2">
                    <AvatarImage src={message.sender.avatarUrl} />
                    <AvatarFallback>{getInitials(message.sender.name)}</AvatarFallback>
                  </Avatar>
                  {message.sender.name} • {formatDate(message.createdAt)}
                </div>
              </div>
            ))}
            
            {["closed", "resolved"].includes(ticket.status) ? (
              <div className="flex items-center justify-center p-4 bg-gray-100 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                <p className="text-gray-700">This ticket has been {ticket.status}.</p>
              </div>
            ) : (
              <div className="mt-4">
                <Textarea
                  placeholder="Add your response..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="mb-2"
                  rows={3}
                />
                <Button onClick={handleSubmitMessage} className="flex items-center">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Send Response
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
      {canUpdateStatus && ticket.status !== "closed" && (
        <CardFooter className="flex justify-end gap-2 border-t pt-4">
          {ticket.status !== "in-progress" && (
            <Button 
              variant="outline" 
              onClick={() => handleStatusChange("in-progress")}
              className="text-yellow-600 border-yellow-300 hover:bg-yellow-50"
            >
              Mark In Progress
            </Button>
          )}
          {ticket.status !== "resolved" && (
            <Button 
              variant="outline" 
              onClick={() => handleStatusChange("resolved")}
              className="text-green-600 border-green-300 hover:bg-green-50"
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Mark Resolved
            </Button>
          )}
          {ticket.status !== "closed" && (
            <Button 
              variant="outline" 
              onClick={() => handleStatusChange("closed")}
              className="text-red-600 border-red-300 hover:bg-red-50"
            >
              <XCircle className="h-4 w-4 mr-2" />
              Close Ticket
            </Button>
          )}
        </CardFooter>
      )}
    </Card>
  );
}
