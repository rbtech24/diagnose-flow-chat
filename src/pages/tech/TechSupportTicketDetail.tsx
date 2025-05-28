
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, MessageSquare, Clock, User } from 'lucide-react';
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
  responses: TicketResponse[];
}

interface TicketResponse {
  id: string;
  content: string;
  author: string;
  authorRole: 'tech' | 'admin' | 'support';
  createdAt: Date;
}

export default function TechSupportTicketDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { handleAsync } = useStandardErrorHandler();
  
  const [ticket, setTicket] = useState<SupportTicket | null>(null);
  const [newResponse, setNewResponse] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchTicket = async () => {
    if (!id) return;
    
    const result = await handleAsync(async () => {
      setIsLoading(true);
      
      // Mock data - replace with actual API call
      const mockTicket: SupportTicket = {
        id,
        title: 'Unable to access diagnostic tools',
        description: 'I am unable to access the diagnostic tools section in the mobile app. The page loads but shows a blank screen.',
        status: 'in_progress',
        priority: 'medium',
        category: 'Technical Issue',
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
        assignedTo: 'Support Team',
        responses: [
          {
            id: '1',
            content: 'Thank you for reporting this issue. We are investigating the problem with the diagnostic tools section. Can you please provide more details about your device and app version?',
            author: 'Support Team',
            authorRole: 'support',
            createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000)
          }
        ]
      };
      
      setTicket(mockTicket);
      return mockTicket;
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
      
      // Mock API call - replace with actual implementation
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const response: TicketResponse = {
        id: Date.now().toString(),
        content: newResponse,
        author: 'You',
        authorRole: 'tech',
        createdAt: new Date()
      };
      
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
        <h1 className="text-3xl font-bold">Support Ticket #{ticket.id}</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Ticket Details */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex justify-between items-start">
              <CardTitle>{ticket.title}</CardTitle>
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
                <p className="font-medium">{ticket.assignedTo || 'Unassigned'}</p>
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
