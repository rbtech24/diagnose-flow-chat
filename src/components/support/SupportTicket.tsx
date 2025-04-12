
import React, { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { Send, PaperclipIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

export type SupportTicketStatus = "open" | "in-progress" | "resolved" | "closed";
export type TicketPriority = "low" | "medium" | "high" | "critical" | "urgent";

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatarUrl?: string;
  phone?: string;
}

export interface Message {
  id: string;
  ticketId: string;
  content: string;
  createdAt: Date;
  sender: User;
}

export interface SupportTicket {
  id: string;
  title: string;
  description: string;
  status: SupportTicketStatus;
  priority: TicketPriority;
  createdAt: Date;
  updatedAt: Date;
  createdBy: User;
  assignedTo?: User;
  messages: Message[];
}

interface SupportTicketComponentProps {
  ticket: SupportTicket;
  onAddMessage: (ticketId: string, content: string) => void;
  onUpdateStatus?: (ticketId: string, status: SupportTicketStatus) => void;
  isDetailView?: boolean;
}

export function SupportTicketComponent({
  ticket,
  onAddMessage,
  onUpdateStatus,
  isDetailView = false
}: SupportTicketComponentProps) {
  const [newMessage, setNewMessage] = useState("");
  const [status, setStatus] = useState<SupportTicketStatus>(ticket.status);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      onAddMessage(ticket.id, newMessage);
      setNewMessage("");
    }
  };

  const handleStatusChange = (newStatus: SupportTicketStatus) => {
    setStatus(newStatus);
    if (onUpdateStatus) {
      onUpdateStatus(ticket.id, newStatus);
    }
  };

  const getStatusColor = (status: SupportTicketStatus) => {
    switch (status) {
      case "open":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "in-progress":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "resolved":
        return "bg-green-100 text-green-800 border-green-200";
      case "closed":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "low":
        return "bg-gray-100 text-gray-800 border-gray-200";
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "high":
        return "bg-red-100 text-red-800 border-red-200";
      case "urgent":
        return "bg-purple-100 text-purple-800 border-purple-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
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
    <Card className="shadow-sm">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl">{ticket.title}</CardTitle>
            <CardDescription>
              Created {formatDistanceToNow(ticket.createdAt, { addSuffix: true })} by {ticket.createdBy.name}
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Badge className={getPriorityColor(ticket.priority)}>
              {ticket.priority.charAt(0).toUpperCase() + ticket.priority.slice(1)} Priority
            </Badge>
            {onUpdateStatus ? (
              <Select value={status} onValueChange={(value) => handleStatusChange(value as SupportTicketStatus)}>
                <SelectTrigger className={`w-[140px] h-7 text-xs ${getStatusColor(status)}`}>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="open">Open</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>
              </Select>
            ) : (
              <Badge className={getStatusColor(ticket.status)}>
                {ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1).replace("-", " ")}
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isDetailView && (
          <div className="mb-6 p-4 bg-muted/50 rounded-md">
            <p className="whitespace-pre-line">{ticket.description}</p>
          </div>
        )}

        {ticket.messages.length > 0 ? (
          <div className="space-y-4 max-h-[500px] overflow-y-auto p-1">
            {ticket.messages.map((message) => (
              <div key={message.id} className="flex gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={message.sender.avatarUrl} alt={message.sender.name} />
                  <AvatarFallback>{getInitials(message.sender.name)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-baseline justify-between mb-1">
                    <div className="font-medium text-sm">{message.sender.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {formatDistanceToNow(message.createdAt, { addSuffix: true })}
                    </div>
                  </div>
                  <div className="bg-muted/30 rounded-md p-3 text-sm">
                    <p className="whitespace-pre-line">{message.content}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            No messages yet. Start the conversation by sending a message.
          </div>
        )}
      </CardContent>
      <CardFooter className="flex flex-col">
        <div className="w-full">
          <Textarea
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="min-h-[100px] resize-none mb-2"
          />
          <div className="flex justify-between items-center mt-2">
            <Button variant="outline" size="sm" className="gap-1">
              <PaperclipIcon className="h-4 w-4" />
              Attach
            </Button>
            <Button onClick={handleSendMessage} disabled={!newMessage.trim()} size="sm" className="gap-1">
              <Send className="h-4 w-4" />
              Send
            </Button>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
