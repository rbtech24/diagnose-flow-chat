
import React, { useState, useEffect } from "react";
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
import { SupportTicket, SupportTicketMessage, SupportTicketStatus } from "@/types/support";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";

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
  const [status, setStatus] = useState<SupportTicketStatus>(ticket.status as SupportTicketStatus);
  const [messages, setMessages] = useState<SupportTicketMessage[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (ticket.id && (isDetailView || ticket.status === "in-progress")) {
      fetchMessages();
    }
  }, [ticket.id, isDetailView]);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("ticket_messages")
        .select(`
          *,
          sender:sender_id(id, name, email, avatar_url)
        `)
        .eq("ticket_id", ticket.id)
        .order("created_at", { ascending: true });

      if (error) throw error;
      setMessages(data || []);
    } catch (err) {
      console.error("Error fetching messages:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      onAddMessage(ticket.id, newMessage);
      setNewMessage("");
      // We'll update messages in parent component and re-fetch
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
      case "critical":
        return "bg-purple-100 text-purple-800 border-purple-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getInitials = (name?: string) => {
    if (!name) return "?";
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
              Created {formatDistanceToNow(new Date(ticket.created_at), { addSuffix: true })} by {ticket.creator?.name || "Unknown"}
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
              <Badge className={getStatusColor(ticket.status as SupportTicketStatus)}>
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

        {loading ? (
          <div className="space-y-4">
            <div className="flex gap-3">
              <Skeleton className="h-8 w-8 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-16 w-full" />
              </div>
            </div>
            <div className="flex gap-3">
              <Skeleton className="h-8 w-8 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-16 w-full" />
              </div>
            </div>
          </div>
        ) : messages.length > 0 ? (
          <div className="space-y-4 max-h-[500px] overflow-y-auto p-1">
            {messages.map((message) => (
              <div key={message.id} className="flex gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={message.sender?.avatar_url} alt={message.sender?.name || "User"} />
                  <AvatarFallback>{getInitials(message.sender?.name)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-baseline justify-between mb-1">
                    <div className="font-medium text-sm">{message.sender?.name || "Unknown User"}</div>
                    <div className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(message.created_at), { addSuffix: true })}
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
