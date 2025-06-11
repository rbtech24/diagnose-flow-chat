
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useSupportTeam } from '@/hooks/useSupportTeam';
import { SupportTeamMember, TicketAssignment } from '@/hooks/useSupportTeam';
import { UserCheck, Users, Zap } from 'lucide-react';

interface TicketAssignmentPanelProps {
  companyId: string;
  teamMembers: SupportTeamMember[];
  assignments: TicketAssignment[];
}

export function TicketAssignmentPanel({ companyId, teamMembers, assignments }: TicketAssignmentPanelProps) {
  const { assignTicket, autoAssignTicket } = useSupportTeam(companyId);
  const [selectedTicket, setSelectedTicket] = useState<string>('');
  const [selectedAgent, setSelectedAgent] = useState<string>('');
  const [isAssigning, setIsAssigning] = useState(false);

  const handleManualAssignment = async () => {
    if (!selectedTicket || !selectedAgent) return;
    
    setIsAssigning(true);
    try {
      await assignTicket(selectedTicket, selectedAgent);
      setSelectedTicket('');
      setSelectedAgent('');
    } catch (error) {
      console.error('Error assigning ticket:', error);
    } finally {
      setIsAssigning(false);
    }
  };

  const handleAutoAssignment = async (ticketId: string) => {
    setIsAssigning(true);
    try {
      await autoAssignTicket(ticketId, 'medium');
    } catch (error) {
      console.error('Error auto-assigning ticket:', error);
    } finally {
      setIsAssigning(false);
    }
  };

  const getWorkloadColor = (current: number, max: number) => {
    const ratio = current / max;
    if (ratio >= 0.9) return 'bg-red-100 text-red-800';
    if (ratio >= 0.7) return 'bg-orange-100 text-orange-800';
    if (ratio >= 0.5) return 'bg-yellow-100 text-yellow-800';
    return 'bg-green-100 text-green-800';
  };

  const availableAgents = teamMembers.filter(member => 
    member.is_active && member.current_tickets < member.max_tickets
  );

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserCheck className="h-5 w-5" />
            Ticket Assignment
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium">Ticket ID</label>
            <Select value={selectedTicket} onValueChange={setSelectedTicket}>
              <SelectTrigger>
                <SelectValue placeholder="Select a ticket" />
              </SelectTrigger>
              <SelectContent>
                {/* This would be populated with actual unassigned tickets */}
                <SelectItem value="ticket-1">Ticket #1</SelectItem>
                <SelectItem value="ticket-2">Ticket #2</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium">Assign to Agent</label>
            <Select value={selectedAgent} onValueChange={setSelectedAgent}>
              <SelectTrigger>
                <SelectValue placeholder="Select an agent" />
              </SelectTrigger>
              <SelectContent>
                {availableAgents.map((agent) => (
                  <SelectItem key={agent.id} value={agent.id}>
                    {agent.name} ({agent.current_tickets}/{agent.max_tickets})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2">
            <Button 
              onClick={handleManualAssignment}
              disabled={!selectedTicket || !selectedAgent || isAssigning}
              className="flex-1"
            >
              Assign Manually
            </Button>
            <Button 
              variant="outline"
              onClick={() => selectedTicket && handleAutoAssignment(selectedTicket)}
              disabled={!selectedTicket || isAssigning}
            >
              <Zap className="h-4 w-4 mr-2" />
              Auto Assign
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Team Workload
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {teamMembers.map((member) => (
              <div key={member.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">{member.name}</p>
                  <p className="text-sm text-muted-foreground capitalize">{member.role}</p>
                </div>
                <div className="text-right">
                  <Badge className={getWorkloadColor(member.current_tickets, member.max_tickets)}>
                    {member.current_tickets}/{member.max_tickets}
                  </Badge>
                  <p className="text-xs text-muted-foreground mt-1">
                    {member.department}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Assignments</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {assignments.slice(0, 5).map((assignment) => (
              <div key={assignment.id} className="flex items-center justify-between text-sm">
                <span>Ticket #{assignment.ticket_id.slice(-6)}</span>
                <span className="text-muted-foreground">
                  → {assignment.agent?.name}
                </span>
              </div>
            ))}
            {assignments.length === 0 && (
              <p className="text-center text-muted-foreground text-sm">No recent assignments</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
