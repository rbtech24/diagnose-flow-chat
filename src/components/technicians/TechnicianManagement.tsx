
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Plus, Loader2 } from "lucide-react";
import { TechnicianList } from "@/components/technicians/TechnicianList";
import { InviteList } from "@/components/technicians/InviteList";
import { AddTechnicianDialog } from "@/components/technicians/AddTechnicianDialog";
import { DeleteTechnicianDialog } from "@/components/technicians/DeleteTechnicianDialog";
import { TechnicianUsageCard } from "@/components/technicians/TechnicianUsageCard";
import { supabase } from '@/utils/supabaseClient';
import { toast } from "react-hot-toast";
import { User } from "@/types/user";
import ErrorBoundary from "@/components/ErrorBoundary";

interface TechnicianManagementProps {
  companyId: string;
}

export function TechnicianManagement({ companyId }: TechnicianManagementProps) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [techToDelete, setTechToDelete] = useState<string | null>(null);
  const [technicians, setTechnicians] = useState<User[]>([]);
  const [invites, setInvites] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [technicianLimits, setTechnicianLimits] = useState({
    maxTechnicians: 5,
    activeCount: 0,
    pendingCount: 0,
    totalCount: 0,
    isAtLimit: false
  });
  
  // Fetch technicians and invites
  const fetchTechnicianData = async () => {
    setIsLoading(true);
    try {
      // Fetch technicians
      const { data: techData, error: techError } = await supabase
        .from('users')
        .select('*')
        .eq('company_id', companyId)
        .eq('role', 'tech');
      
      if (techError) throw techError;
      
      // Fetch pending invites
      const { data: inviteData, error: inviteError } = await supabase
        .from('technician_invites')
        .select('*')
        .eq('company_id', companyId)
        .eq('status', 'pending');
      
      if (inviteError) throw inviteError;
      
      // Check company limits
      const { data: limitsData, error: limitsError } = await supabase
        .rpc('check_company_technician_limits', { p_company_id: companyId });
      
      if (limitsError) throw limitsError;
      
      setTechnicians(techData || []);
      setInvites(inviteData || []);
      
      if (limitsData) {
        const activeCount = limitsData.active_count || 0;
        const pendingCount = limitsData.pending_count || 0;
        
        setTechnicianLimits({
          maxTechnicians: limitsData.max_technicians || 5,
          activeCount: activeCount,
          pendingCount: pendingCount,
          totalCount: activeCount + pendingCount,
          isAtLimit: limitsData.is_at_limit || false
        });
      }
    } catch (error) {
      console.error('Error fetching technician data:', error);
      toast.error('Failed to load technician data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (companyId) {
      fetchTechnicianData();
    }
  }, [companyId]);

  const handleAddTechnician = async (data: { name: string; email: string; phone: string }) => {
    try {
      // Call the RPC function to invite a technician
      const { data: inviteData, error } = await supabase
        .rpc('invite_technician', {
          p_email: data.email,
          p_name: data.name,
          p_phone: data.phone || null,
          p_company_id: companyId
        });

      if (error) throw error;
      
      toast.success('Invitation sent successfully!');
      fetchTechnicianData(); // Refresh data
      return true;
    } catch (error) {
      console.error('Error inviting technician:', error);
      toast.error('Failed to send invitation');
      return false;
    }
  };

  const handleCancelInvite = async (inviteId: string) => {
    try {
      const { error } = await supabase
        .from('technician_invites')
        .update({ status: 'cancelled' })
        .eq('id', inviteId);

      if (error) throw error;
      
      toast.success('Invitation cancelled');
      fetchTechnicianData(); // Refresh data
    } catch (error) {
      console.error('Error cancelling invite:', error);
      toast.error('Failed to cancel invitation');
    }
  };

  const handleArchiveTechnician = async (techId: string) => {
    try {
      const { error } = await supabase
        .from('users')
        .update({ status: 'archived' })
        .eq('id', techId);

      if (error) throw error;
      
      toast.success('Technician archived');
      fetchTechnicianData(); // Refresh data
    } catch (error) {
      console.error('Error archiving technician:', error);
      toast.error('Failed to archive technician');
    }
  };

  const handleDeleteTechnician = async (techId: string) => {
    try {
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', techId);

      if (error) throw error;
      
      toast.success('Technician removed permanently');
      fetchTechnicianData(); // Refresh data
    } catch (error) {
      console.error('Error deleting technician:', error);
      toast.error('Failed to delete technician');
    }
  };

  const confirmDeleteTechnician = (techId: string) => {
    setTechToDelete(techId);
    setIsDeleteDialogOpen(true);
  };

  const handleExecuteDelete = () => {
    if (techToDelete) {
      handleDeleteTechnician(techToDelete);
      setIsDeleteDialogOpen(false);
      setTechToDelete(null);
    }
  };

  const handleExecuteArchive = () => {
    if (techToDelete) {
      handleArchiveTechnician(techToDelete);
      setIsDeleteDialogOpen(false);
      setTechToDelete(null);
    }
  };

  return (
    <ErrorBoundary>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">Technician Management</h2>
            <p className="text-muted-foreground">Manage your technician accounts</p>
          </div>
          <Button 
            onClick={() => setIsAddDialogOpen(true)}
            disabled={technicianLimits.isAtLimit}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Technician
          </Button>
        </div>

        <TechnicianUsageCard limits={technicianLimits} />

        <Separator className="my-6" />

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2">Loading technician data...</span>
          </div>
        ) : (
          <div className="grid gap-6">
            <TechnicianList 
              technicians={technicians} 
              onArchive={handleArchiveTechnician}
              onDelete={confirmDeleteTechnician}
            />

            <InviteList 
              invites={invites} 
              onCancel={handleCancelInvite}
            />
          </div>
        )}

        <AddTechnicianDialog 
          isOpen={isAddDialogOpen} 
          onClose={() => setIsAddDialogOpen(false)}
          onSubmit={handleAddTechnician}
        />

        <DeleteTechnicianDialog 
          isOpen={isDeleteDialogOpen}
          onClose={() => setIsDeleteDialogOpen(false)}
          onDelete={handleExecuteDelete}
          onArchive={handleExecuteArchive}
        />
      </div>
    </ErrorBoundary>
  );
}
