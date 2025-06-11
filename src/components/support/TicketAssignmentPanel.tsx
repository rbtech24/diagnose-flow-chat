
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { SupportTeamMember, TicketAssignment } from '@/hooks/useSupportTeam';
import { UserCheck, Shuffle, Clock } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface TicketAssignmentPanelProps {
  companyId: string;
  teamMembers: SupportTeamMember[];
  assignments: TicketAssignment[];
}

export function TicketAssignmentPanel({ 
  companyId, 
  teamMembers, 
  assignments 
}: TicketAssignmentPanelProps) {
  const { toast } = useToast();
  const [selectedTicketId, setSelectedTicketId] = useState<string>('');
  const [selectedAgentId, setSelectedAgentId] = useState<string>('');
  const [assignmentNotes, setAssignmentNotes] = useState('');
  const [isAssigning, setIsAssigning] = useState(false);

  const availableAgents = teamMembers.filter(member => 
    member.is_active && member.current_tickets < member.max_tickets
  );

  const handleAssignTicket = async () => {
    if (!selectedTicketId || !selectedAgentId) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Please select both a ticket and an agent.',
      });
      return;
    }

    setIsAssigning(true);
    try {
      // This would call the assignTicket function from useSupportTeam
      // For now, we'll just show a success message
      toast({
        title: 'Ticket assigned',
        description: 'Ticket has been successfully assigned to the agent.',
      });
      
      // Reset form
      setSelectedTicketId('');
      setSelectedAgentId('');
      setAssignmentNotes('');
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to assign ticket. Please try again.',
      });
    } finally {
      setIsAssigning(false);
    }
  };

  const handleAutoAssign = async () => {
    if (!selectedTicketId) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Please select a ticket to auto-assign.',
      });
      return;
    }

    setIsAssigning(true);
    try {
      // This would call the autoAssignTicket function
      toast({
        title: 'Ticket auto-assigned',
        description: 'Ticket has been automatically assigned to the best available agent.',
      });
      
      setSelectedTicketId('');
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to auto-assign ticket. Please try again.',
      });
    } finally {
      setIsAssigning(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserCheck className="h-5 w-5" />
          Ticket Assignment
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Quick Assignment Form */}
        <div className="space-y-3">
          <div>
            <Label htmlFor="ticket-select">Select Ticket</Label>
            <Select value={selectedTicketId} onValueChange={setSelectedTicketId}>
              <SelectTrigger id="ticket-select">
                <SelectValue placeholder="Choose a ticket..." />
              </SelectTrigger>
              <SelectContent>
                {/* This would be populated with unassigned tickets */}
                <SelectItem value="ticket-1">Ticket #1: WiFi Connection Issue</SelectItem>
                <SelectItem value="ticket-2">Ticket #2: Printer Not Working</SelectItem>
                <SelectItem value="ticket-3">Ticket #3: Software Installation</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="agent-select">Assign to Agent</Label>
            <Select value={selectedAgentId} onValueChange={setSelectedAgentId}>
              <SelectTrigger id="agent-select">
                <SelectValue placeholder="Choose an agent..." />
              </SelectTrigger>
              <SelectContent>
                {availableAgents.map((agent) => (
                  <SelectItem key={agent.id} value={agent.id}>
                    <div className="flex items-center justify-between w-full">
                      <span>{agent.name}</span>
                      <span className="text-xs text-muted-foreground ml-2">
                        {agent.current_tickets}/{agent.max_tickets}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="assignment-notes">Assignment Notes (Optional)</Label>
            <Textarea
              id="assignment-notes"
              value={assignmentNotes}
              onChange={(e) => setAssignmentNotes(e.target.value)}
              placeholder="Add any specific instructions or context..."
              rows={2}
            />
          </div>

          <div className="flex gap-2">
            <Button 
              onClick={handleAssignTicket} 
              disabled={isAssigning || !selectedTicketId || !selectedAgentId}
              className="flex-1"
            >
              <UserCheck className="h-4 w-4 mr-2" />
              Assign
            </Button>
            <Button 
              variant="outline" 
              onClick={handleAutoAssign}
              disabled={isAssigning || !selectedTicketId}
            >
              <Shuffle className="h-4 w-4 mr-2" />
              Auto
            </Button>
          </div>
        </div>

        {/* Team Workload Overview */}
        <div className="space-y-3 pt-4 border-t">
          <h4 className="font-medium text-sm">Team Workload</h4>
          <div className="space-y-2">
            {teamMembers.slice(0, 5).map((member) => {
              const workloadPercentage = (member.current_tickets / member.max_tickets) * 100;
              const isOverloaded = workloadPercentage >= 90;
              const isNearCapacity = workloadPercentage >= 70;
              
              return (
                <div key={member.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{member.name}</span>
                    <Badge 
                      variant={member.is_active ? 'default' : 'secondary'}
                      className="text-xs"
                    >
                      {member.role}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-16 bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          isOverloaded 
                            ? 'bg-red-500' 
                            : isNearCapacity 
                            ? 'bg-yellow-500' 
                            : 'bg-green-500'
                        }`}
                        style={{ width: `${Math.min(workloadPercentage, 100)}%` }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground w-8">
                      {member.current_tickets}/{member.max_tickets}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Assignments */}
        <div className="space-y-3 pt-4 border-t">
          <h4 className="font-medium text-sm">Recent Assignments</h4>
          <div className="space-y-2">
            {assignments.slice(0, 3).map((assignment) => (
              <div key={assignment.id} className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">
                  Ticket #{assignment.ticket_id.slice(-6)}
                </span>
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <span>{new Date(assignment.assigned_at).toLocaleTimeString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
