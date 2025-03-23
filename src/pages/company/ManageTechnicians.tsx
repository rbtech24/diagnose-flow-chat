
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { User, TechnicianInvite } from "@/types/user";
import { SubscriptionPlan, License } from "@/types/subscription";
import { Plus, Mail, Phone, User as UserIcon, AlertCircle, Clock, Check, X, Archive, Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/components/ui/alert-dialog";
import { supabase } from "@/integrations/supabase/client";
import { useUserRole } from "@/hooks/useUserRole";

export default function ManageTechnicians() {
  const [technicians, setTechnicians] = useState<User[]>([]);
  const [invites, setInvites] = useState<TechnicianInvite[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newTechnician, setNewTechnician] = useState({
    name: "",
    email: "",
    phone: ""
  });
  const [technicianLimits, setTechnicianLimits] = useState<{
    activeCount: number;
    pendingCount: number;
    maxTechnicians: number;
    totalCount: number;
    isAtLimit: boolean;
  }>({
    activeCount: 0,
    pendingCount: 0,
    maxTechnicians: 0,
    totalCount: 0,
    isAtLimit: false
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [techToDelete, setTechToDelete] = useState<string | null>(null);
  const { userRole } = useUserRole();

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

  useEffect(() => {
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
    
    loadAllData();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewTechnician(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddTechnician = async () => {
    if (!newTechnician.name || !newTechnician.email) {
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
      const { data, error } = await supabase.rpc(
        'invite_technician',
        { 
          p_email: newTechnician.email,
          p_name: newTechnician.name,
          p_phone: newTechnician.phone || null,
          p_company_id: userData.company_id
        }
      );
      
      if (error) throw error;
      
      // Refresh invites list and limits
      await Promise.all([
        fetchInvites(),
        fetchTechnicianLimits()
      ]);
      
      setNewTechnician({ name: "", email: "", phone: "" });
      setIsAddDialogOpen(false);
      toast.success("Invitation sent successfully");
    } catch (error) {
      console.error('Error sending invitation:', error);
      toast.error('Failed to send invitation');
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

  const confirmDeleteTechnician = (techId: string) => {
    setTechToDelete(techId);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteTechnician = async () => {
    if (!techToDelete) return;
    
    try {
      const { error } = await supabase
        .from('technicians')
        .delete()
        .eq('id', techToDelete);
      
      if (error) throw error;
      
      // Remove from local state
      setTechnicians(technicians.filter(tech => tech.id !== techToDelete));
      
      // Refresh limits
      await fetchTechnicianLimits();
      
      setIsDeleteDialogOpen(false);
      setTechToDelete(null);
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

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="mt-2 text-gray-500">Loading technician data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Technician Management</h1>
          <p className="text-gray-500">Manage your technician accounts</p>
        </div>
        <Button 
          onClick={() => setIsAddDialogOpen(true)}
          disabled={technicianLimits.isAtLimit}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Technician
        </Button>
      </div>

      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium">Technician Usage</h3>
              <p className="text-gray-500">
                {technicianLimits.activeCount} active + {technicianLimits.pendingCount} pending = {technicianLimits.totalCount} total of {technicianLimits.maxTechnicians} allowed
              </p>
            </div>
            {technicianLimits.isAtLimit && (
              <Alert className="w-auto">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Limit reached</AlertTitle>
                <AlertDescription>
                  Upgrade your plan to add more technicians
                </AlertDescription>
              </Alert>
            )}
          </div>
        </CardContent>
      </Card>

      <Separator className="my-6" />

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Active Technicians</CardTitle>
          </CardHeader>
          <CardContent>
            {technicians.length === 0 ? (
              <div className="text-center py-4 text-gray-500">
                No active technicians found
              </div>
            ) : (
              <div className="space-y-4">
                {technicians.map((tech) => (
                  <div key={tech.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center mr-4">
                        {tech.avatarUrl ? (
                          <img 
                            src={tech.avatarUrl} 
                            alt={tech.name} 
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        ) : (
                          <UserIcon className="h-5 w-5 text-gray-500" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-medium">{tech.name}</h3>
                        <div className="flex flex-col sm:flex-row sm:space-x-4 text-sm text-gray-500">
                          <span className="flex items-center">
                            <Mail className="h-3 w-3 mr-1" /> {tech.email}
                          </span>
                          {tech.phone && (
                            <span className="flex items-center">
                              <Phone className="h-3 w-3 mr-1" /> {tech.phone}
                            </span>
                          )}
                        </div>
                        {tech.status === "archived" && (
                          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded mt-1 inline-block">
                            Archived
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      {!tech.status || tech.status !== "archived" ? (
                        <>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleArchiveTechnician(tech.id)}
                          >
                            <Archive className="h-4 w-4 text-amber-500" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => confirmDeleteTechnician(tech.id)}
                          >
                            <X className="h-4 w-4 text-red-500" />
                          </Button>
                        </>
                      ) : (
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => confirmDeleteTechnician(tech.id)}
                        >
                          <X className="h-4 w-4 text-red-500" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pending Invitations</CardTitle>
          </CardHeader>
          <CardContent>
            {invites.length === 0 ? (
              <div className="text-center py-4 text-gray-500">
                No pending invitations
              </div>
            ) : (
              <div className="space-y-4">
                {invites.map((invite) => (
                  <div key={invite.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                        <Mail className="h-5 w-5 text-blue-500" />
                      </div>
                      <div>
                        <h3 className="font-medium">{invite.name}</h3>
                        <div className="flex flex-col sm:flex-row sm:space-x-4 text-sm text-gray-500">
                          <span className="flex items-center">
                            <Mail className="h-3 w-3 mr-1" /> {invite.email}
                          </span>
                          {invite.phone && (
                            <span className="flex items-center">
                              <Phone className="h-3 w-3 mr-1" /> {invite.phone}
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-amber-600 mt-1 flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          Expires in {Math.ceil((invite.expiresAt.getTime() - Date.now()) / (1000 * 3600 * 24))} days
                        </div>
                      </div>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleCancelInvite(invite.id)}
                    >
                      <X className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Technician</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                value={newTechnician.name}
                onChange={handleInputChange}
                placeholder="Enter technician name"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={newTechnician.email}
                onChange={handleInputChange}
                placeholder="Enter technician email"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone (optional)</Label>
              <Input
                id="phone"
                name="phone"
                value={newTechnician.phone}
                onChange={handleInputChange}
                placeholder="Enter technician phone"
              />
            </div>
            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddTechnician}>
                Send Invitation
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to permanently delete this technician? This action cannot be undone.
              Consider archiving instead to retain their data and history.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </AlertDialogCancel>
            <Button 
              variant="outline" 
              className="border-amber-500 text-amber-600 hover:bg-amber-50"
              onClick={() => {
                if (techToDelete) {
                  handleArchiveTechnician(techToDelete);
                  setIsDeleteDialogOpen(false);
                  setTechToDelete(null);
                }
              }}
            >
              <Archive className="h-4 w-4 mr-2" />
              Archive Instead
            </Button>
            <AlertDialogAction
              className="bg-red-500 hover:bg-red-600"
              onClick={handleDeleteTechnician}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
