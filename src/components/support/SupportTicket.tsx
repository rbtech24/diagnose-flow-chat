
import { SupportTicket, SupportTicketMessage, SupportTicketStatus, TicketPriority } from "@/types/support";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from "date-fns";
import { useState } from "react";
import { Clock, CornerDownLeft, AlertCircle, CheckCircle2, Ban } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface SupportTicketProps {
  ticket: SupportTicket;
  messages: SupportTicketMessage[];
  onUpdateStatus?: (id: string, status: SupportTicketStatus) => void;
  onAddMessage?: (ticketId: string, message: string) => void;
  isAdmin?: boolean;
}

export function SupportTicketComponent({ 
  ticket, 
  messages, 
  onUpdateStatus,
  onAddMessage,
  isAdmin = false
}: SupportTicketProps) {
  const [newMessage, setNewMessage] = useState("");
  const [sendingMessage, setSendingMessage] = useState(false);

  const statusColors: Record<SupportTicketStatus, string> = {
    "open": "bg-yellow-100 text-yellow-800",
    "in-progress": "bg-blue-100 text-blue-800",
    "resolved": "bg-green-100 text-green-800",
    "closed": "bg-gray-100 text-gray-800"
  };

  const priorityColors: Record<TicketPriority, string> = {
    "low": "bg-gray-100 text-gray-800",
    "medium": "bg-blue-100 text-blue-800",
    "high": "bg-orange-100 text-orange-800",
    "critical": "bg-red-100 text-red-800"
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !onAddMessage) return;

    try {
      setSendingMessage(true);
      
      // For demo, we'll update the state directly and try Supabase if available
      onAddMessage(ticket.id, newMessage);
      
      // Try to save to Supabase if it's set up
      try {
        const { data: userData } = await supabase.auth.getUser();
        const userId = userData?.user?.id;
        
        if (userId) {
          // Only attempt to insert if user is authenticated
          await supabase
            .from('ticket_messages')
            .insert({
              ticket_id: ticket.id,
              content: newMessage.trim(),
              sender_id: userId
            });
        }
      } catch (err) {
        console.warn("Could not save to Supabase, but state updated for demo:", err);
      }
      
      setNewMessage("");
      toast.success("Message sent successfully");
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message");
    } finally {
      setSendingMessage(false);
    }
  };

  const statusIcons = {
    "open": <AlertCircle className="h-4 w-4 text-yellow-600" />,
    "in-progress": <Clock className="h-4 w-4 text-blue-600" />,
    "resolved": <CheckCircle2 className="h-4 w-4 text-green-600" />,
    "closed": <Ban className="h-4 w-4 text-gray-600" />
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
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-2">
          <div className="flex flex-col gap-4 md:flex-row md:justify-between md:items-center">
            <div>
              <h2 className="text-2xl font-bold">{ticket.title}</h2>
              <div className="flex flex-wrap items-center gap-2 mt-2 text-sm text-muted-foreground">
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  {format(new Date(ticket.created_at), 'MMM d, yyyy')}
                </div>
                <div className="flex items-center">
                  Opened by: {ticket.creator?.name || "Unknown"}
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {isAdmin && onUpdateStatus ? (
                <select 
                  value={ticket.status}
                  onChange={(e) => onUpdateStatus(ticket.id, e.target.value as SupportTicketStatus)}
                  className={`h-7 text-xs rounded-md px-2 border ${statusColors[ticket.status as SupportTicketStatus]}`}
                >
                  <option value="open">Open</option>
                  <option value="in-progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                  <option value="closed">Closed</option>
                </select>
              ) : (
                <Badge className={statusColors[ticket.status as SupportTicketStatus]}>
                  <span className="flex items-center">
                    {statusIcons[ticket.status as SupportTicketStatus]}
                    <span className="ml-1">{ticket.status}</span>
                  </span>
                </Badge>
              )}
              <Badge className={priorityColors[ticket.priority as TicketPriority]}>
                {ticket.priority}
              </Badge>
              {ticket.assignee && (
                <Badge variant="outline">
                  Assigned to: {ticket.assignee.name}
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="prose max-w-none mt-4">
            <p className="whitespace-pre-line">{ticket.description}</p>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <h3 className="font-semibold text-xl">Messages</h3>
        </CardHeader>
        <CardContent className="space-y-6">
          {messages.length > 0 ? (
            messages.map((message) => (
              <div key={message.id} className="flex gap-4">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={message.sender?.avatar_url} alt="Avatar" />
                  <AvatarFallback>{getInitials(message.sender?.name)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div className="font-medium">{message.sender?.name || "Unknown"}</div>
                    <div className="text-xs text-muted-foreground">
                      {format(new Date(message.created_at), 'MMM d, yyyy h:mm a')}
                    </div>
                  </div>
                  <div className="mt-2 text-sm">
                    <p className="whitespace-pre-line">{message.content}</p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <p>No messages yet</p>
            </div>
          )}
        </CardContent>
        <CardFooter>
          <div className="w-full space-y-4">
            <Textarea 
              placeholder="Type your message..." 
              className="w-full" 
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
            />
            <div className="flex justify-end">
              <Button 
                onClick={handleSendMessage} 
                disabled={!newMessage.trim() || sendingMessage}
              >
                <CornerDownRight className="h-4 w-4 mr-2" />
                Send
              </Button>
            </div>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}

function CornerDownRight(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <polyline points="15 10 20 15 15 20" />
      <path d="M4 4v7a4 4 0 0 0 4 4h12" />
    </svg>
  );
}

export type { SupportTicket, SupportTicketMessage, SupportTicketStatus, TicketPriority };
