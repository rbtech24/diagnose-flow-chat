
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SupportTicket as SupportTicketType, SupportTicketMessage, SupportTicketStatus, TicketPriority } from "@/types/support";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from "date-fns";
import { Paperclip, Upload, AlertTriangle, User, AlertCircle, Clock, X } from "lucide-react";
import { toast } from "sonner";
import { fetchAvailableAgents } from "@/services/supportService";

export interface SupportTicketProps {
  ticket: SupportTicketType;
  messages?: SupportTicketMessage[];
  onAddMessage?: (ticketId: string, content: string, attachments?: File[]) => Promise<void>;
  onUpdateStatus?: (ticketId: string, status: SupportTicketStatus) => Promise<void>;
  onUpdatePriority?: (ticketId: string, priority: TicketPriority) => Promise<void>;
  onAssignTicket?: (ticketId: string, userId: string) => Promise<void>;
  isDetailView?: boolean;
}

export const SupportTicket: React.FC<SupportTicketProps> = ({
  ticket,
  messages = [],
  onAddMessage,
  onUpdateStatus,
  onUpdatePriority,
  onAssignTicket,
  isDetailView = false,
}) => {
  const [newMessage, setNewMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [isUpdatingPriority, setIsUpdatingPriority] = useState(false);
  const [isAssigning, setIsAssigning] = useState(false);
  const [attachments, setAttachments] = useState<File[]>([]);
  const [availableAgents, setAvailableAgents] = useState<Array<{id: string, name: string, avatar_url?: string}>>([]);

  // Fetch available agents for assignment
  useEffect(() => {
    if (isDetailView && onAssignTicket) {
      const getAgents = async () => {
        try {
          const agents = await fetchAvailableAgents();
          setAvailableAgents(agents);
        } catch (error) {
          console.error("Error fetching available agents:", error);
        }
      };
      
      getAgents();
    }
  }, [isDetailView, onAssignTicket]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() && attachments.length === 0 || !onAddMessage) return;
    
    setIsSubmitting(true);
    try {
      await onAddMessage(ticket.id, newMessage, attachments);
      setNewMessage("");
      setAttachments([]);
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message", {
        description: "Please try again later."
      });
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
      toast.error("Failed to update status", {
        description: "Please try again later."
      });
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handlePriorityChange = async (priority: string) => {
    if (!onUpdatePriority) return;
    
    setIsUpdatingPriority(true);
    try {
      await onUpdatePriority(ticket.id, priority as TicketPriority);
    } catch (error) {
      console.error("Error updating priority:", error);
      toast.error("Failed to update priority", {
        description: "Please try again later."
      });
    } finally {
      setIsUpdatingPriority(false);
    }
  };

  const handleAssignTicket = async (userId: string) => {
    if (!onAssignTicket) return;
    
    setIsAssigning(true);
    try {
      await onAssignTicket(ticket.id, userId);
      toast.success("Ticket assigned successfully");
    } catch (error) {
      console.error("Error assigning ticket:", error);
      toast.error("Failed to assign ticket", {
        description: "Please try again later."
      });
    } finally {
      setIsAssigning(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setAttachments(prev => [...prev, ...newFiles]);
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
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
        return <Badge variant="destructive" className="flex items-center gap-1"><AlertCircle className="h-3 w-3" /> Critical</Badge>;
      case "high":
        return <Badge className="bg-orange-500 flex items-center gap-1"><AlertTriangle className="h-3 w-3" /> High</Badge>;
      case "medium":
        return <Badge variant="secondary" className="flex items-center gap-1"><Clock className="h-3 w-3" /> Medium</Badge>;
      case "low":
        return <Badge variant="outline" className="flex items-center gap-1">Low</Badge>;
      default:
        return <Badge variant="outline">{priority}</Badge>;
    }
  };

  const renderStatusBadge = (status: string) => {
    switch (status) {
      case "open":
        return <Badge variant="outline">Open</Badge>;
      case "in_progress":
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
        
        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
          {onUpdatePriority && isDetailView && (
            <Select
              value={ticket.priority}
              onValueChange={handlePriorityChange}
              disabled={isUpdatingPriority || ticket.status === "closed"}
            >
              <SelectTrigger className="w-[130px]">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
              </SelectContent>
            </Select>
          )}
          
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
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>
          )}

          {onAssignTicket && isDetailView && (
            <Select
              value={ticket.assigned_to || ""}
              onValueChange={handleAssignTicket}
              disabled={isAssigning || ticket.status === "closed"}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder={ticket.assigned_to ? "Reassign" : "Assign Ticket"} />
              </SelectTrigger>
              <SelectContent>
                {!ticket.assigned_to && <SelectItem value="">Unassigned</SelectItem>}
                {availableAgents.map(agent => (
                  <SelectItem key={agent.id} value={agent.id}>
                    {agent.name}
                  </SelectItem>
                ))}
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
                <AvatarImage src={ticket.created_by_user?.avatar_url} alt={ticket.created_by_user?.name || "User"} />
                <AvatarFallback className="bg-primary/10 text-primary">
                  {getInitials(ticket.created_by_user?.name || "User")}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-medium">{ticket.created_by_user?.name || "User"}</span>
                    <span className="text-muted-foreground text-sm ml-2">
                      {formatDate(ticket.created_at)}
                    </span>
                  </div>
                </div>
                <div className="mt-2 text-sm">
                  {ticket.description}
                </div>
                
                {/* Show ticket attachments if any */}
                {ticket.attachments && ticket.attachments.length > 0 && (
                  <div className="mt-4 space-y-2">
                    <p className="text-sm font-medium">Attachments:</p>
                    <div className="flex flex-wrap gap-2">
                      {ticket.attachments.map(attachment => (
                        <a 
                          key={attachment.id}
                          href={attachment.url}
                          target="_blank"
                          rel="noopener noreferrer" 
                          className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 p-2 rounded-md text-sm hover:bg-slate-200 dark:hover:bg-slate-700"
                        >
                          <Paperclip className="h-4 w-4" />
                          <span className="truncate max-w-[150px]">{attachment.filename}</span>
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Display assigned to information if available */}
            {ticket.assigned_to && isDetailView && (
              <div className="flex items-center gap-2 p-2 bg-blue-50 dark:bg-blue-900/20 rounded-md">
                <User className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                <span className="text-sm">
                  Assigned to: <span className="font-medium">
                    {availableAgents.find(a => a.id === ticket.assigned_to)?.name || "Unknown Agent"}
                  </span>
                </span>
              </div>
            )}

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
                  
                  {/* Show message attachments if any */}
                  {message.attachments && message.attachments.length > 0 && (
                    <div className="mt-2 space-y-2">
                      <div className="flex flex-wrap gap-2">
                        {message.attachments.map((attachment, idx) => (
                          <a 
                            key={idx}
                            href={attachment.url}
                            target="_blank"
                            rel="noopener noreferrer" 
                            className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 p-2 rounded-md text-sm hover:bg-slate-200 dark:hover:bg-slate-700"
                          >
                            <Paperclip className="h-4 w-4" />
                            <span className="truncate max-w-[150px]">{attachment.filename}</span>
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
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
                
                {/* Show selected attachments */}
                {attachments.length > 0 && (
                  <div className="mb-3">
                    <p className="text-sm font-medium mb-2">Attachments:</p>
                    <div className="flex flex-wrap gap-2">
                      {attachments.map((file, idx) => (
                        <div key={idx} className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 p-2 rounded-md text-sm">
                          <Paperclip className="h-4 w-4" />
                          <span className="truncate max-w-[150px]">{file.name}</span>
                          <button 
                            onClick={() => removeAttachment(idx)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="flex justify-between">
                  {/* File attachment button */}
                  <div>
                    <label htmlFor="file-upload" className="cursor-pointer">
                      <div className="flex items-center gap-2 p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800">
                        <Paperclip className="h-5 w-5" />
                        <span>Attach files</span>
                      </div>
                      <input
                        id="file-upload"
                        type="file"
                        multiple
                        className="hidden"
                        onChange={handleFileChange}
                      />
                    </label>
                  </div>
                  
                  {/* Send button */}
                  <Button 
                    onClick={handleSendMessage}
                    disabled={isSubmitting || (!newMessage.trim() && attachments.length === 0)}
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
