
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MessageSquare, User, Clock } from "lucide-react";
import { format } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export interface SupportTicket {
  id: string;
  title: string;
  description: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  created_at: string;
  updated_at: string;
  user?: {
    id: string;
    name: string;
    email: string;
    avatar_url?: string;
  };
  messages?: {
    id: string;
    content: string;
    created_at: string;
    user_id: string;
    user?: {
      name: string;
      avatar_url?: string;
    };
  }[];
}

export interface SupportTicketProps {
  ticket: SupportTicket;
  onUpdate?: (data: any) => Promise<void>;
  onAddMessage?: (content: string) => Promise<void>;
}

export function SupportTicket({ ticket, onUpdate, onAddMessage }: SupportTicketProps) {
  const [newMessage, setNewMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low': return 'bg-blue-100 text-blue-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'urgent': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'resolved': return 'bg-purple-100 text-purple-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "MMM d, yyyy 'at' h:mm a");
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  const handleSubmitMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newMessage.trim() || !onAddMessage) return;
    
    setIsSubmitting(true);
    try {
      await onAddMessage(newMessage);
      setNewMessage("");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="mb-4">
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <div>
          <CardTitle className="text-xl font-bold">{ticket.title}</CardTitle>
          <div className="flex items-center space-x-2 mt-1 text-sm text-muted-foreground">
            <div className="flex items-center">
              <Clock className="mr-1 h-3.5 w-3.5" />
              <span>{formatDate(ticket.created_at)}</span>
            </div>
          </div>
        </div>
        <div className="flex space-x-2">
          <Badge className={getPriorityColor(ticket.priority)}>
            {ticket.priority.charAt(0).toUpperCase() + ticket.priority.slice(1)}
          </Badge>
          <Badge className={getStatusColor(ticket.status)}>
            {ticket.status === 'in_progress' ? 'In Progress' : 
            ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="mb-4 text-gray-700">
          {ticket.description}
        </div>
        
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <User className="h-4 w-4 mr-1 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              {ticket.user?.name || 'Anonymous'}
            </span>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? 'Hide Messages' : 'Show Messages'}
          </Button>
        </div>
        
        {isExpanded && (
          <div className="mt-6 space-y-4">
            <div className="border-t pt-4">
              <h4 className="font-medium flex items-center mb-2">
                <MessageSquare className="mr-2 h-4 w-4" />
                Messages
              </h4>
              
              <div className="space-y-4">
                {ticket.messages && ticket.messages.length > 0 ? (
                  ticket.messages.map((message) => (
                    <div key={message.id} className="flex space-x-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={message.user?.avatar_url} />
                        <AvatarFallback>
                          {message.user?.name ? getInitials(message.user.name) : 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium">{message.user?.name || 'User'}</p>
                          <p className="text-xs text-muted-foreground">
                            {formatDate(message.created_at)}
                          </p>
                        </div>
                        <p className="mt-1 text-sm">{message.content}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-muted-foreground text-sm py-4">
                    No messages yet
                  </p>
                )}
              </div>
            </div>
            
            <form onSubmit={handleSubmitMessage} className="mt-4">
              <Textarea
                placeholder="Type your reply here..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="min-h-[100px]"
              />
              <div className="mt-2 flex justify-end">
                <Button 
                  type="submit" 
                  disabled={!newMessage.trim() || isSubmitting}
                >
                  {isSubmitting ? "Sending..." : "Send Reply"}
                </Button>
              </div>
            </form>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
