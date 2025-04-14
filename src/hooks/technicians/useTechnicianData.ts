import { useState, useEffect } from "react";
import { User, TechnicianInvite } from "@/types/user";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { DbCompany } from "@/types/database";

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
  const { user } = useAuth();
  
  const companyId = user?.companyId;

  const fetchTechnicians = async () => {
    if (!companyId) return [];
    
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('company_id', companyId)
        .eq('role', 'tech')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      const formattedTechs = data.map(tech => ({
        id: tech.id,
        name: tech.name || '',
        email: tech.email,
        role: tech.role as 'admin' | 'company' | 'tech',
        status: tech.status as 'active' | 'inactive' | 'pending' | 'archived' | 'deleted',
        phone: tech.phone,
        avatarUrl: tech.avatar_url,
        companyId: tech.company_id,
      }));
      
      setTechnicians(formattedTechs);
      return formattedTechs;
    } catch (error) {
      console.error('Error fetching technicians:', error);
      toast.error('Failed to load technicians');
      return [];
    }
  };

  const fetchInvites = async () => {
    if (!companyId) return [];
    
    try {
      const { data, error } = await supabase
        .from('technician_invites')
        .select('*')
        .eq('company_id', companyId)
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      const formattedInvites = data.map(invite => ({
        id: invite.id,
        email: invite.email,
        name: invite.name,
        phone: invite.phone,
        companyId: invite.company_id,
        status: invite.status as 'pending' | 'accepted' | 'expired',
        createdAt: new Date(invite.created_at),
        expiresAt: new Date(invite.expires_at),
      }));
      
      setInvites(formattedInvites);
      return formattedInvites;
    } catch (error) {
      console.error('Error fetching invites:', error);
      toast.error('Failed to load pending invitations');
      return [];
    }
  };

  const fetchTechnicianLimits = async () => {
    if (!companyId) return null;
    
    try {
      // Get active technicians count
      const { data: activeTechs, error: techError } = await supabase
        .from('users')
        .select('id')
        .eq('company_id', companyId)
        .eq('role', 'tech')
        .eq('status', 'active');
        
      if (techError) throw techError;
      
      // Get pending invites count
      const { data: pendingInvites, error: inviteError } = await supabase
        .from('technician_invites')
        .select('id')
        .eq('company_id', companyId)
        .eq('status', 'pending')
        .gt('expires_at', new Date().toISOString());
        
      if (inviteError) throw inviteError;
      
      // Get company plan details to determine max technicians
      const { data: company, error: companyError } = await supabase
        .from('companies')
        .select('subscription_tier, trial_status')
        .eq('id', companyId)
        .single();
        
      if (companyError) throw companyError;
      
      // Cast company to DbCompany for proper TypeScript checking
      const dbCompany = company as DbCompany;
      
      // Determine max technicians based on plan
      let maxTechnicians = 5; // Default for basic plan
      
      if (dbCompany?.subscription_tier === 'professional') {
        maxTechnicians = 20;
      } else if (dbCompany?.subscription_tier === 'enterprise') {
        maxTechnicians = 100;
      }
      
      const activeCount = activeTechs?.length || 0;
      const pendingCount = pendingInvites?.length || 0;
      const totalCount = activeCount + pendingCount;
      
      const limits = {
        activeCount,
        pendingCount,
        maxTechnicians,
        totalCount,
        isAtLimit: totalCount >= maxTechnicians
      };
      
      setTechnicianLimits(limits);
      return limits;
    } catch (error) {
      console.error('Error fetching technician limits:', error);
      toast.error('Failed to load subscription limits');
      return null;
    }
  };

  const handleAddTechnician = async (data: { name: string; email: string; phone: string }) => {
    if (!companyId) {
      toast.error("Company ID is required");
      return false;
    }
    
    if (!data.name || !data.email) {
      toast.error("Name and email are required");
      return false;
    }

    try {
      // First check if we're at the limit
      if (technicianLimits.isAtLimit) {
        toast.error("You've reached your maximum number of technicians. Please upgrade your plan.");
        return false;
      }
      
      // Generate a unique token
      const token = crypto.randomUUID();
      
      // Create the invitation
      const { data: invite, error } = await supabase
        .from('technician_invites')
        .insert([{
          name: data.name,
          email: data.email,
          phone: data.phone,
          company_id: companyId,
          created_by: user?.id,
          token,
          status: 'pending',
          expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days
        }])
        .select()
        .single();
        
      if (error) throw error;
      
      // Add to local state
      const newInvite: TechnicianInvite = {
        id: invite.id,
        email: invite.email,
        name: invite.name,
        phone: invite.phone,
        companyId: invite.company_id,
        status: invite.status as 'pending',
        createdAt: new Date(invite.created_at),
        expiresAt: new Date(invite.expires_at),
      };
      
      setInvites(prev => [newInvite, ...prev]);
      
      // In a real application, you would send an email to the technician here
      toast.success(`Invitation sent to ${data.email}`);
      
      // Refresh technician limits
      fetchTechnicianLimits();
      
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
      
      // Refresh technician limits
      fetchTechnicianLimits();
      
      toast.success("Invitation cancelled successfully");
      return true;
    } catch (error) {
      console.error('Error canceling invitation:', error);
      toast.error('Failed to cancel invitation');
      return false;
    }
  };

  const handleDeleteTechnician = async (techId: string) => {
    try {
      // First check if this is the last admin
      if (technicians.filter(t => t.role === 'admin').length <= 1) {
        const tech = technicians.find(t => t.id === techId);
        if (tech?.role === 'admin') {
          toast.error("Cannot delete the last admin user");
          return false;
        }
      }
      
      // In a real implementation, we would update the status to 'deleted'
      const { error } = await supabase
        .from('users')
        .update({ status: 'deleted', updated_at: new Date().toISOString() })
        .eq('id', techId);
      
      if (error) throw error;
      
      // Remove from local state
      setTechnicians(technicians.filter(tech => tech.id !== techId));
      
      // Refresh technician limits
      fetchTechnicianLimits();
      
      toast.success("Technician removed successfully");
      return true;
    } catch (error) {
      console.error('Error deleting technician:', error);
      toast.error('Failed to delete technician');
      return false;
    }
  };

  const handleArchiveTechnician = async (techId: string) => {
    try {
      // Update the status to 'archived'
      const { error } = await supabase
        .from('users')
        .update({ status: 'archived', updated_at: new Date().toISOString() })
        .eq('id', techId);
      
      if (error) throw error;
      
      // Update local state
      setTechnicians(technicians.map(tech => 
        tech.id === techId ? { ...tech, status: 'archived' } : tech
      ));
      
      // Refresh technician limits
      fetchTechnicianLimits();
      
      toast.success("Technician archived successfully");
      return true;
    } catch (error) {
      console.error('Error archiving technician:', error);
      toast.error('Failed to archive technician');
      return false;
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
    if (companyId) {
      loadAllData();
    } else {
      setIsLoading(false);
    }
  }, [companyId]);

  return {
    technicians,
    invites,
    technicianLimits,
    isLoading,
    handleAddTechnician: async (data: { name: string; email: string; phone: string }) => {
      if (!companyId) {
        toast.error("Company ID is required");
        return false;
      }
      
      if (!data.name || !data.email) {
        toast.error("Name and email are required");
        return false;
      }

      try {
        // First check if we're at the limit
        if (technicianLimits.isAtLimit) {
          toast.error("You've reached your maximum number of technicians. Please upgrade your plan.");
          return false;
        }
        
        // Generate a unique token
        const token = crypto.randomUUID();
        
        // Create the invitation
        const { data: invite, error } = await supabase
          .from('technician_invites')
          .insert([{
            name: data.name,
            email: data.email,
            phone: data.phone,
            company_id: companyId,
            created_by: user?.id,
            token,
            status: 'pending',
            expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days
          }])
          .select()
          .single();
          
        if (error) throw error;
        
        // Add to local state
        const newInvite: TechnicianInvite = {
          id: invite.id,
          email: invite.email,
          name: invite.name,
          phone: invite.phone,
          companyId: invite.company_id,
          status: invite.status as 'pending',
          createdAt: new Date(invite.created_at),
          expiresAt: new Date(invite.expires_at),
        };
        
        setInvites(prev => [newInvite, ...prev]);
        
        // In a real application, you would send an email to the technician here
        toast.success(`Invitation sent to ${data.email}`);
        
        // Refresh technician limits
        fetchTechnicianLimits();
        
        return true;
      } catch (error) {
        console.error('Error sending invitation:', error);
        toast.error('Failed to send invitation');
        return false;
      }
    },
    handleCancelInvite: async (inviteId: string) => {
      try {
        const { error } = await supabase
          .from('technician_invites')
          .delete()
          .eq('id', inviteId);
        
        if (error) throw error;
        
        // Remove from local state
        setInvites(invites.filter(invite => invite.id !== inviteId));
        
        // Refresh technician limits
        fetchTechnicianLimits();
        
        toast.success("Invitation cancelled successfully");
        return true;
      } catch (error) {
        console.error('Error canceling invitation:', error);
        toast.error('Failed to cancel invitation');
        return false;
      }
    },
    handleDeleteTechnician: async (techId: string) => {
      try {
        // First check if this is the last admin
        if (technicians.filter(t => t.role === 'admin').length <= 1) {
          const tech = technicians.find(t => t.id === techId);
          if (tech?.role === 'admin') {
            toast.error("Cannot delete the last admin user");
            return false;
          }
        }
        
        // In a real implementation, we would update the status to 'deleted'
        const { error } = await supabase
          .from('users')
          .update({ status: 'deleted', updated_at: new Date().toISOString() })
          .eq('id', techId);
        
        if (error) throw error;
        
        // Remove from local state
        setTechnicians(technicians.filter(tech => tech.id !== techId));
        
        // Refresh technician limits
        fetchTechnicianLimits();
        
        toast.success("Technician removed successfully");
        return true;
      } catch (error) {
        console.error('Error deleting technician:', error);
        toast.error('Failed to delete technician');
        return false;
      }
    },
    handleArchiveTechnician: async (techId: string) => {
      try {
        // Update the status to 'archived'
        const { error } = await supabase
          .from('users')
          .update({ status: 'archived', updated_at: new Date().toISOString() })
          .eq('id', techId);
        
        if (error) throw error;
        
        // Update local state
        setTechnicians(technicians.map(tech => 
          tech.id === techId ? { ...tech, status: 'archived' } : tech
        ));
        
        // Refresh technician limits
        fetchTechnicianLimits();
        
        toast.success("Technician archived successfully");
        return true;
      } catch (error) {
        console.error('Error archiving technician:', error);
        toast.error('Failed to archive technician');
        return false;
      }
    },
    refreshData: loadAllData
  };
}
