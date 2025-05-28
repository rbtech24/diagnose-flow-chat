
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Clock, User, MessageSquare } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useStandardErrorHandler } from '@/utils/standardErrorHandler';

interface SupportTicket {
  id: string;
  title: string;
  description: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: string;
  createdAt: Date;
  updatedAt: Date;
  assignedTo?: string;
  userId: string;
  responses: TicketResponse[];
}

interface TicketResponse {
  id: string;
  content: string;
  author: string;
  authorRole: 'tech' | 'admin' | 'support';
  createdAt: Date;
}

export default function SupportTicketDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { handleAsync } = useStandardErrorHandler();
  
  const [ticket, setTicket] = useState<SupportTicket | null>(null);
  const [newResponse, setNewResponse] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [assignedTechnician, setAssignedTechnician] = useState<string>('');

  const fetchTicket = async () => {
    if (!id) return;
    
    const result = await handleAsync(async () => {
      setIsLoading(true);
      
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Fetch ticket from database
      const { data: ticketData, error: ticketError } = await supabase
        .from('support_tickets')
        .select('*')
        .eq('id', id)
        .single();

      if (ticketError) {
        throw new Error(`Failed to fetch ticket: ${ticketError.message}`);
      }

      if (!ticketData) {
        throw new Error('Ticket not found');
      }

      // Fetch assigned technician name if available
      let assignedToName = 'Unassigned';
      if (ticketData.assigned_to) {
        const { data: techData } = await supabase
          .from('technicians')
          .select('id, email')
          .eq('id', ticketData.assigned_to)
          .single();
          
        if (techData) {
          assignedToName = techData.email.split('@')[0];
        }
      }
      setAssignedTechnician(assignedToName);

      // Fetch ticket responses separately
      const { data: responsesData, error: responsesError } = await supabase
        .from('support_ticket_messages')
        .select('*')
        .eq('ticket_id', id)
        .order('created_at');

      const responses: TicketResponse[] = (responsesData || []).map((response: any) => ({
        id: response.id,
        content: response.content,
        author: response.user_id === user.id ? 'You' : assignedToName,
        authorRole: response.user_id === user.id ? 'tech' as const : 'support' as const,
        createdAt: new Date(response.created_at)
      }));

      // Format ticket data
      const formattedTicket: SupportTicket = {
        id: ticketData.id,
        title: ticketData.title,
        description: ticketData.description,
        status: ticketData.status as SupportTicket['status'],
        priority: ticketData.priority as SupportTicket['priority'],
        category: 'General', // Default category since column doesn't exist in DB
        createdAt: new Date(ticketData.created_at),
        updatedAt: new Date(ticketData.updated_at),
        assignedTo: assignedToName,
        userId: ticketData.user_id,
        responses
      };
      
      setTicket(formattedTicket);
      return formattedTicket;
    }, {
      context: 'fetchSupportTicket',
      fallbackMessage: 'Failed to load ticket details'
    });
    
    setIsLoading(false);
    return result.data;
  };

  const handleAddResponse = async () => {
    if (!newResponse.trim() || !ticket) return;
    
    const result = await handleAsync(async () => {
      setIsSubmitting(true);
      
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Insert new response
      const { data: responseData, error } = await supabase
        .from('support_ticket_messages')
        .insert({
          ticket_id: ticket.id,
          content: newResponse,
          user_id: user.id
        })
        .select()
        .single();

      if (error) {
        throw new Error(`Failed to add response: ${error.message}`);
      }

      // Create response object
      const response: TicketResponse = {
        id: responseData.id,
        content: newResponse,
        author: 'You',
        authorRole: 'tech',
        createdAt: new Date(responseData.created_at)
      };
      
      // Update ticket with new response
      setTicket(prev => prev ? {
        ...prev,
        responses: [...prev.responses, response],
        updatedAt: new Date()
      } : null);
      
      setNewResponse('');
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
    fetchTicket();
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
          <Button onClick={() => navigate('/tech/support')} className="mt-4">
            Back to Support
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" onClick={() => navigate('/tech/support')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Support
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Support Ticket #{ticket.id}</h1>
          <p className="text-gray-600 mt-1">View and manage your support ticket</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Ticket Details */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle>{ticket.title}</CardTitle>
                <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                  <span className="flex items-center gap-1">
                    <User className="h-4 w-4" />
                    Created by you
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {ticket.createdAt.toLocaleString()}
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
                  Responses ({ticket.responses.length})
                </h3>
                <div className="space-y-4">
                  {ticket.responses.map((response) => (
                    <div key={response.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4" />
                          <span className="font-medium">{response.author}</span>
                          <Badge variant="outline" className="text-xs">
                            {response.authorRole}
                          </Badge>
                        </div>
                        <span className="text-sm text-gray-500">
                          {response.createdAt.toLocaleString()}
                        </span>
                      </div>
                      <p className="text-gray-700">{response.content}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Add Response */}
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

        {/* Ticket Info */}
        <Card>
          <CardHeader>
            <CardTitle>Ticket Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Category</label>
                <p className="font-medium">{ticket.category}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-500">Assigned To</label>
                <p className="font-medium">{assignedTechnician}</p>
              </div>
              
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-gray-500" />
                <div>
                  <label className="text-sm font-medium text-gray-500">Created</label>
                  <p className="text-sm">{ticket.createdAt.toLocaleString()}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-gray-500" />
                <div>
                  <label className="text-sm font-medium text-gray-500">Last Updated</label>
                  <p className="text-sm">{ticket.updatedAt.toLocaleString()}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
