
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface SupportTeamMember {
  id: string;
  user_id: string;
  company_id: string;
  name: string;
  email: string;
  role: 'agent' | 'supervisor' | 'manager';
  department?: string;
  is_active: boolean;
  max_tickets: number;
  current_tickets: number;
  specializations: string[];
  created_at: string;
  updated_at: string;
}

export interface TicketAssignment {
  id: string;
  ticket_id: string;
  assigned_to: string;
  assigned_by: string;
  assigned_at: string;
  notes?: string;
  is_active: boolean;
  agent?: SupportTeamMember;
}

export function useSupportTeam(companyId?: string) {
  const [teamMembers, setTeamMembers] = useState<SupportTeamMember[]>([]);
  const [assignments, setAssignments] = useState<TicketAssignment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTeamMembers = async () => {
    if (!companyId) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('support_team_members')
        .select('*')
        .eq('company_id', companyId)
        .eq('is_active', true)
        .order('name');

      if (error) throw error;
      
      // Transform the data to match our interface types
      const members: SupportTeamMember[] = (data || []).map(member => ({
        ...member,
        role: member.role as 'agent' | 'supervisor' | 'manager'
      }));
      
      setTeamMembers(members);
    } catch (err) {
      console.error('Error fetching team members:', err);
      setError('Failed to load team members');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAssignments = async (ticketId?: string) => {
    setIsLoading(true);
    try {
      let query = supabase
        .from('ticket_assignments')
        .select(`
          *,
          agent:support_team_members!ticket_assignments_assigned_to_fkey (
            id,
            name,
            email,
            role,
            user_id,
            company_id,
            is_active,
            max_tickets,
            current_tickets,
            specializations,
            created_at,
            updated_at,
            department
          )
        `)
        .eq('is_active', true);

      if (ticketId) {
        query = query.eq('ticket_id', ticketId);
      }

      const { data, error } = await query.order('assigned_at', { ascending: false });

      if (error) throw error;
      
      const transformedAssignments: TicketAssignment[] = (data || []).map(assignment => ({
        ...assignment,
        agent: assignment.agent ? {
          ...assignment.agent,
          role: assignment.agent.role as 'agent' | 'supervisor' | 'manager'
        } : undefined
      }));
      
      setAssignments(transformedAssignments);
    } catch (err) {
      console.error('Error fetching assignments:', err);
      setError('Failed to load assignments');
    } finally {
      setIsLoading(false);
    }
  };

  const assignTicket = async (ticketId: string, agentId: string, notes?: string) => {
    try {
      // First, deactivate existing assignments
      await supabase
        .from('ticket_assignments')
        .update({ is_active: false })
        .eq('ticket_id', ticketId);

      // Create new assignment
      const { data, error } = await supabase
        .from('ticket_assignments')
        .insert({
          ticket_id: ticketId,
          assigned_to: agentId,
          notes,
        })
        .select()
        .single();

      if (error) throw error;

      // Update ticket assigned_to field
      const agent = teamMembers.find(m => m.id === agentId);
      if (agent) {
        await supabase
          .from('support_tickets')
          .update({ assigned_to: agent.user_id })
          .eq('id', ticketId);
      }

      await fetchAssignments();
      return data;
    } catch (err) {
      console.error('Error assigning ticket:', err);
      throw new Error('Failed to assign ticket');
    }
  };

  const autoAssignTicket = async (ticketId: string, priority: string = 'medium') => {
    try {
      const { data, error } = await supabase.rpc('assign_ticket_to_best_agent', {
        p_ticket_id: ticketId,
        p_company_id: companyId,
        p_priority: priority
      });

      if (error) throw error;
      await fetchAssignments();
      return data;
    } catch (err) {
      console.error('Error auto-assigning ticket:', err);
      throw new Error('Failed to auto-assign ticket');
    }
  };

  const addTeamMember = async (memberData: Partial<SupportTeamMember>) => {
    try {
      // Ensure required fields are present
      const newMember = {
        company_id: companyId!,
        name: memberData.name || '',
        email: memberData.email || '',
        role: memberData.role || 'agent' as 'agent',
        user_id: memberData.user_id,
        department: memberData.department,
        is_active: memberData.is_active ?? true,
        max_tickets: memberData.max_tickets ?? 10,
        current_tickets: memberData.current_tickets ?? 0,
        specializations: memberData.specializations ?? [],
      };

      const { data, error } = await supabase
        .from('support_team_members')
        .insert(newMember)
        .select()
        .single();

      if (error) throw error;
      await fetchTeamMembers();
      return data;
    } catch (err) {
      console.error('Error adding team member:', err);
      throw new Error('Failed to add team member');
    }
  };

  const updateTeamMember = async (memberId: string, updates: Partial<SupportTeamMember>) => {
    try {
      const { data, error } = await supabase
        .from('support_team_members')
        .update(updates)
        .eq('id', memberId)
        .select()
        .single();

      if (error) throw error;
      await fetchTeamMembers();
      return data;
    } catch (err) {
      console.error('Error updating team member:', err);
      throw new Error('Failed to update team member');
    }
  };

  useEffect(() => {
    if (companyId) {
      fetchTeamMembers();
    }
  }, [companyId]);

  return {
    teamMembers,
    assignments,
    isLoading,
    error,
    fetchTeamMembers,
    fetchAssignments,
    assignTicket,
    autoAssignTicket,
    addTeamMember,
    updateTeamMember,
  };
}
