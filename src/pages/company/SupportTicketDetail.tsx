
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Clock, User, MessageSquare } from 'lucide-react';
import { useSupportTickets, SupportTicket, SupportTicketMessage } from '@/hooks/useSupportTickets';
import { useStandardErrorHandler } from '@/utils/standardErrorHandler';

export default function SupportTicketDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { handleAsync } = useStandardErrorHandler();
  const { getTicketById, getTicketMessages, addMessage } = useSupportTickets();
  
  const [ticket, setTicket] = useState<SupportTicket | null>(null);
  const [messages, setMessages] = useState<SupportTicketMessage[]>([]);
  const [newResponse, setNewResponse] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchTicketData = async () => {
    if (!id) return;
    
    const result = await handleAsync(async () => {
      setIsLoading(true);
      
      const ticketData = await getTicketById(id);
      const messagesData = await getTicketMessages(id);
      
      setTicket(ticketData);
      setMessages(messagesData);
      
      return { ticket: ticketData, messages: messagesData };
    }, {
      context: 'fetchSupportTicketDetail',
      fallbackMessage: 'Failed to load ticket details'
    });
    
    setIsLoading(false);
    return result.data;
  };

  const handleAddResponse = async () => {
    if (!newResponse.trim() || !id) return;
    
    const result = await handleAsync(async () => {
      setIsSubmitting(true);
      
      const newMessage = await addMessage({
        content: newResponse,
        ticket_id: id
      });
      
      setMessages(prev => [...prev, newMessage]);
      setNewResponse('');
      
      return newMessage;
    }, {
      context: 'addTicketResponse',
      fallbackMessage: 'Failed to add response'
    });
    
    setIsSubmitting(false);
  };

  const getStatusColor = (status: SupportTicket['status']) => {
    switch (status) {
      case 'open': return 'bg-blue-100 text-blue-800';
      case 'in_progress': return 'bg-yellow-100 text-yellow-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: SupportTicket['priority']) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  useEffect(() => {
    fetchTicketData();
  }, [id]);

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <p className="text-lg text-muted-foreground">Loading ticket...</p>
        </div>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <p className="text-lg text-muted-foreground">Ticket not found</p>
          <Button onClick={() => navigate('/company/support')} className="mt-4">
            Back to Support
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" onClick={() => navigate('/company/support')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Support
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Support Ticket #{ticket.id}</h1>
          <p className="text-gray-600 mt-1">View and manage your support ticket</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle>{ticket.title}</CardTitle>
                <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                  <span className="flex items-center gap-1">
                    <User className="h-4 w-4" />
                    Created by {ticket.created_by_user?.name || 'Unknown'}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {new Date(ticket.created_at).toLocaleString()}
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <Badge className={getStatusColor(ticket.status)}>
                  {ticket.status.replace('_', ' ')}
                </Badge>
                <Badge className={getPriorityColor(ticket.priority)}>
                  {ticket.priority}
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <h3 className="font-medium mb-2">Description</h3>
                <p className="text-gray-700">{ticket.description}</p>
              </div>

              <div>
                <h3 className="font-medium mb-4 flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  Messages ({messages.length})
                </h3>
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div key={message.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4" />
                          <span className="font-medium">
                            {message.sender?.name || 'Unknown User'}
                          </span>
                          <Badge variant="outline" className="text-xs">
                            {message.sender?.role || 'User'}
                          </Badge>
                        </div>
                        <span className="text-sm text-gray-500">
                          {new Date(message.created_at).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-gray-700">{message.content}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t pt-6">
                <h3 className="font-medium mb-3">Add Response</h3>
                <div className="space-y-3">
                  <Textarea
                    value={newResponse}
                    onChange={(e) => setNewResponse(e.target.value)}
                    placeholder="Type your response..."
                    rows={4}
                  />
                  <Button 
                    onClick={handleAddResponse} 
                    disabled={!newResponse.trim() || isSubmitting}
                  >
                    {isSubmitting ? 'Adding...' : 'Add Response'}
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Ticket Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Category</label>
                <p className="font-medium">{ticket.category || 'General'}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-500">Assigned To</label>
                <p className="font-medium">{ticket.assignedTo || 'Unassigned'}</p>
              </div>
              
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-gray-500" />
                <div>
                  <label className="text-sm font-medium text-gray-500">Created</label>
                  <p className="text-sm">{new Date(ticket.created_at).toLocaleString()}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-gray-500" />
                <div>
                  <label className="text-sm font-medium text-gray-500">Last Updated</label>
                  <p className="text-sm">{new Date(ticket.updated_at).toLocaleString()}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
