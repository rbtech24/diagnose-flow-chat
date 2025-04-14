
import { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, AlertCircle, Clock, Flag } from "lucide-react";
import { User } from "@/types/user";
import { formatDistanceToNow } from "date-fns";

export type SupportTicketStatus = "open" | "in-progress" | "resolved" | "closed";
export type SupportTicketPriority = "low" | "medium" | "high" | "critical";

export interface SupportTicket {
  id: string;
  title: string;
  description: string;
  status: SupportTicketStatus;
  priority: SupportTicketPriority;
  createdAt: Date;
  updatedAt: Date;
  createdBy: User;
  messages: {
    id: string;
    ticketId: string;
    content: string;
    createdAt: Date;
    sender: User;
  }[];
}

interface SupportTicketProps {
  ticket: SupportTicket;
  onAddMessage: (ticketId: string, content: string) => void;
}

export function SupportTicketComponent({ ticket, onAddMessage }: SupportTicketProps) {
  const [messageContent, setMessageContent] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!messageContent.trim()) return;
    
    setIsSubmitting(true);
    try {
      await onAddMessage(ticket.id, messageContent);
      setMessageContent("");
    } catch (error) {
      console.error("Error adding message:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusBadge = (status: SupportTicketStatus) => {
    switch (status) {
      case "open":
        return <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200">Open</Badge>;
      case "in-progress":
        return <Badge variant="outline" className="bg-amber-50 text-amber-600 border-amber-200">In Progress</Badge>;
      case "resolved":
        return <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">Resolved</Badge>;
      case "closed":
        return <Badge variant="outline" className="bg-gray-50 text-gray-600 border-gray-200">Closed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getPriorityBadge = (priority: SupportTicketPriority) => {
    switch (priority) {
      case "low":
        return <Badge variant="outline" className="bg-gray-50 text-gray-600 border-gray-200">Low</Badge>;
      case "medium":
        return <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200">Medium</Badge>;
      case "high":
        return <Badge variant="outline" className="bg-amber-50 text-amber-600 border-amber-200">High</Badge>;
      case "critical":
        return <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200">Critical</Badge>;
      default:
        return <Badge variant="outline">{priority}</Badge>;
    }
  };

  const timeAgo = formatDistanceToNow(new Date(ticket.updatedAt), { addSuffix: true });
  const lastMessage = ticket.messages.length > 0 
    ? ticket.messages[ticket.messages.length - 1] 
    : null;
  
  return (
    <Card className="mb-4">
      <CardHeader className="pb-2">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-medium">{ticket.title}</h3>
              {getStatusBadge(ticket.status)}
              <div className="flex items-center ml-2">
                <Flag className="h-3 w-3 mr-1" />
                {getPriorityBadge(ticket.priority)}
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              <span className="inline-flex items-center">
                <Clock className="h-3 w-3 mr-1" /> {timeAgo}
              </span>
              <span className="inline-flex items-center ml-3">
                <MessageSquare className="h-3 w-3 mr-1" /> {ticket.messages.length} messages
              </span>
            </p>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? "Hide Details" : "View Details"}
          </Button>
        </div>
      </CardHeader>

      {isExpanded && (
        <>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex items-start gap-3 mb-4">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={ticket.createdBy.avatarUrl} />
                    <AvatarFallback>{ticket.createdBy.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <p className="text-sm font-medium">{ticket.createdBy.name}</p>
                      <span className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(ticket.createdAt), { addSuffix: true })}
                      </span>
                    </div>
                    <p className="text-sm mt-1">{ticket.description}</p>
                  </div>
                </div>

                {ticket.messages.length === 0 ? (
                  <div className="text-center py-4 bg-gray-50 rounded-md">
                    <AlertCircle className="h-4 w-4 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">No messages yet</p>
                  </div>
                ) : (
                  <div className="space-y-4 mt-4">
                    {ticket.messages.map((message) => (
                      <div key={message.id} className="flex items-start gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={message.sender.avatarUrl} />
                          <AvatarFallback>{message.sender.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex justify-between">
                            <p className="text-sm font-medium">{message.sender.name}</p>
                            <span className="text-xs text-muted-foreground">
                              {formatDistanceToNow(new Date(message.createdAt), { addSuffix: true })}
                            </span>
                          </div>
                          <p className="text-sm mt-1">{message.content}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {(ticket.status === "open" || ticket.status === "in-progress") && (
                <div className="pt-2">
                  <Textarea
                    placeholder="Add a message..."
                    value={messageContent}
                    onChange={(e) => setMessageContent(e.target.value)}
                    className="mb-2"
                  />
                  <Button
                    onClick={handleSubmit}
                    disabled={isSubmitting || !messageContent.trim()}
                  >
                    {isSubmitting ? "Sending..." : "Send Message"}
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </>
      )}

      {!isExpanded && (
        <CardFooter className="pt-0 pb-4">
          <div className="w-full text-sm truncate">
            {lastMessage ? (
              <div className="flex items-start gap-2">
                <Avatar className="h-6 w-6 mt-0.5">
                  <AvatarImage src={lastMessage.sender.avatarUrl} />
                  <AvatarFallback>{lastMessage.sender.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <span className="font-medium mr-1">{lastMessage.sender.name}:</span>
                  <span className="text-muted-foreground truncate">{lastMessage.content}</span>
                </div>
              </div>
            ) : (
              <p className="text-muted-foreground">No messages yet</p>
            )}
          </div>
        </CardFooter>
      )}
    </Card>
  );
}
