
import { useState, useEffect } from "react";
import { User, TechnicianInvite } from "@/types/user";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

// Type for technician limits
export interface TechnicianLimits {
  activeCount: number;
  pendingCount: number;
  maxTechnicians: number;
  totalCount: number;
  isAtLimit: boolean;
}

export function useTechnicianData() {
  const [technicians, setTechnicians] = useState<User[]>([]);
  const [invites, setInvites] = useState<TechnicianInvite[]>([]);
  const [technicianLimits, setTechnicianLimits] = useState<TechnicianLimits>({
    activeCount: 0,
    pendingCount: 0,
    maxTechnicians: 0,
    totalCount: 0,
    isAtLimit: false
  });
  const [isLoading, setIsLoading] = useState(true);

  const fetchTechnicians = async () => {
    try {
      const { data: userData, error: userError } = await supabase
        .from('technicians')
        .select('*')
        .eq('role', 'tech');
      
      if (userError) throw userError;

      // Format data to match User type
      const formattedUsers: User[] = userData.map(tech => ({
        id: tech.id,
        name: tech.email.split('@')[0], // Temporary, in real app would use proper name field
        email: tech.email,
        phone: tech.phone || undefined,
        role: tech.role as "admin" | "company" | "tech",
        companyId: tech.company_id,
        status: tech.status as "active" | "archived" | "deleted" | undefined
      }));
      
      setTechnicians(formattedUsers);
    } catch (error) {
      console.error('Error fetching technicians:', error);
      toast.error('Failed to load technicians');
    }
  };

  const fetchInvites = async () => {
    try {
      const { data: inviteData, error: inviteError } = await supabase
        .from('technician_invites')
        .select('*')
        .eq('status', 'pending');
      
      if (inviteError) throw inviteError;
      
      // Format data to match TechnicianInvite type
      const formattedInvites: TechnicianInvite[] = inviteData.map(invite => ({
        id: invite.id,
        email: invite.email,
        name: invite.name,
        phone: invite.phone || undefined,
        companyId: invite.company_id,
        status: invite.status as "pending" | "accepted" | "expired",
        createdAt: new Date(invite.created_at),
        expiresAt: new Date(invite.expires_at)
      }));
      
      setInvites(formattedInvites);
    } catch (error) {
      console.error('Error fetching invites:', error);
      toast.error('Failed to load pending invitations');
    }
  };

  const fetchTechnicianLimits = async () => {
    try {
      // Get current user's company ID
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data: userData, error: userError } = await supabase
        .from('technicians')
        .select('company_id')
        .eq('id', user.id)
        .single();
      
      if (userError) throw userError;
      
      // Call the stored function to get limits
      const { data, error } = await supabase.rpc(
        'check_company_technician_limits',
        { p_company_id: userData.company_id }
      );
      
      if (error) throw error;
      
      // Convert the returned data to our expected format with proper typing
      // Use type assertion to tell TypeScript about the structure
      const typedData = data as {
        active_count: number;
        pending_count: number;
        max_technicians: number;
        total_count: number;
        is_at_limit: boolean;
      };
      
      setTechnicianLimits({
        activeCount: typedData.active_count,
        pendingCount: typedData.pending_count,
        maxTechnicians: typedData.max_technicians,
        totalCount: typedData.total_count,
        isAtLimit: typedData.is_at_limit
      });
    } catch (error) {
      console.error('Error fetching technician limits:', error);
      toast.error('Failed to load subscription limits');
    }
  };

  const handleAddTechnician = async (data: { name: string; email: string; phone: string }) => {
    if (!data.name || !data.email) {
      toast.error("Name and email are required");
      return;
    }

    if (technicianLimits.isAtLimit) {
      toast.error(`Your plan only allows ${technicianLimits.maxTechnicians} technicians. Please upgrade to add more.`);
      return;
    }

    try {
      // Get current user's company ID
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data: userData, error: userError } = await supabase
        .from('technicians')
        .select('company_id')
        .eq('id', user.id)
        .single();
      
      if (userError) throw userError;

      // Call the stored function to create invitation
      const { data: inviteData, error } = await supabase.rpc(
        'invite_technician',
        { 
          p_email: data.email,
          p_name: data.name,
          p_phone: data.phone || null,
          p_company_id: userData.company_id
        }
      );
      
      if (error) throw error;
      
      // Refresh invites list and limits
      await Promise.all([
        fetchInvites(),
        fetchTechnicianLimits()
      ]);
      
      toast.success("Invitation sent successfully");
      return true;
    } catch (error) {
      console.error('Error sending invitation:', error);
      toast.error('Failed to send invitation');
      return false;
    }
  };

  const handleCancelInvite = async (inviteId: string) => {
    try {
      const { error } = await supabase
        .from('technician_invites')
        .delete()
        .eq('id', inviteId);
      
      if (error) throw error;
      
      // Remove from local state
      setInvites(invites.filter(invite => invite.id !== inviteId));
      
      // Refresh limits
      await fetchTechnicianLimits();
      
      toast.success("Invitation canceled");
    } catch (error) {
      console.error('Error canceling invitation:', error);
      toast.error('Failed to cancel invitation');
    }
  };

  const handleDeleteTechnician = async (techId: string) => {
    try {
      const { error } = await supabase
        .from('technicians')
        .delete()
        .eq('id', techId);
      
      if (error) throw error;
      
      // Remove from local state
      setTechnicians(technicians.filter(tech => tech.id !== techId));
      
      // Refresh limits
      await fetchTechnicianLimits();
      
      toast.success("Technician removed successfully");
    } catch (error) {
      console.error('Error deleting technician:', error);
      toast.error('Failed to delete technician');
    }
  };

  const handleArchiveTechnician = async (techId: string) => {
    try {
      const { error } = await supabase
        .from('technicians')
        .update({ status: 'archived' })
        .eq('id', techId);
      
      if (error) throw error;
      
      // Update in local state
      setTechnicians(technicians.map(tech => {
        if (tech.id === techId) {
          return { ...tech, status: 'archived' as const };
        }
        return tech;
      }));
      
      toast.success("Technician archived successfully");
    } catch (error) {
      console.error('Error archiving technician:', error);
      toast.error('Failed to archive technician');
    }
  };

  const loadAllData = async () => {
    setIsLoading(true);
    try {
      await Promise.all([
        fetchTechnicians(),
        fetchInvites(),
        fetchTechnicianLimits()
      ]);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  return {
    technicians,
    invites,
    technicianLimits,
    isLoading,
    handleAddTechnician,
    handleCancelInvite,
    handleDeleteTechnician,
    handleArchiveTechnician,
    refreshData: loadAllData
  };
}
