
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { User, TechnicianInvite } from "@/types/user";
import { Plus, Mail, Phone, User as UserIcon, AlertCircle, Clock, X, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from "@/components/ui/skeleton";

export default function ManageTechnicians() {
  const [technicians, setTechnicians] = useState<User[]>([]);
  const [invites, setInvites] = useState<TechnicianInvite[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newTechnician, setNewTechnician] = useState({
    name: "",
    email: "",
    phone: ""
  });
  const [technicianLimit, setTechnicianLimit] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        // Get current user's company ID
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          throw new Error('No authenticated user found');
        }
        
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('company_id')
          .eq('id', user.id)
          .single();
          
        if (userError) {
          throw userError;
        }
        
        if (!userData?.company_id) {
          throw new Error('No company ID found for user');
        }
        
        const companyId = userData.company_id;
        
        // Fetch technicians
        const { data: techData, error: techError } = await supabase
          .from('technicians')
          .select(`
            id,
            email,
            phone,
            status,
            role,
            company_id
          `)
          .eq('company_id', companyId);
          
        if (techError) {
          throw techError;
        }
        
        // Get user details for each technician
        const technicianUsers: User[] = await Promise.all(
          (techData || []).map(async tech => {
            // Get user info from auth.users using our users table
            const { data: userDetails, error: detailsError } = await supabase
              .from('users')
              .select('name, avatar_url')
              .eq('id', tech.id)
              .single();
            
            if (detailsError) {
              console.warn(`Could not find user details for tech ${tech.id}`, detailsError);
            }
            
            return {
              id: tech.id,
              name: userDetails?.name || tech.email?.split('@')[0] || 'Unknown',
              email: tech.email,
              phone: tech.phone,
              role: tech.role,
              companyId: tech.company_id,
              avatarUrl: userDetails?.avatar_url
            };
          })
        );
        
        // Fetch pending invites
        const { data: inviteData, error: inviteError } = await supabase
          .from('technician_invites')
          .select('*')
          .eq('company_id', companyId)
          .eq('status', 'pending')
          .gt('expires_at', new Date().toISOString());
          
        if (inviteError) {
          throw inviteError;
        }
        
        const pendingInvites: TechnicianInvite[] = (inviteData || []).map(invite => ({
          id: invite.id,
          email: invite.email,
          name: invite.name,
          phone: invite.phone,
          companyId: invite.company_id,
          status: invite.status,
          createdAt: new Date(invite.created_at),
          expiresAt: new Date(invite.expires_at)
        }));
        
        // Get company subscription info and tech limits
        const { data: companyData, error: companyError } = await supabase
          .from('companies')
          .select('subscription_tier')
          .eq('id', companyId)
          .single();
          
        if (companyError) {
          console.warn('Could not fetch company subscription tier:', companyError);
        }
        
        // Get tech limits based on subscription tier
        const { data: limitData, error: limitError } = await supabase
          .from('tech_company_limits')
          .select('max_technicians')
          .eq('company_id', companyId)
          .single();
          
        if (limitError) {
          console.warn('Could not fetch company tech limits:', limitError);
        }
        
        // Set technician limit
        let maxTechs = limitData?.max_technicians;
        if (!maxTechs) {
          // Fallback based on subscription tier
          maxTechs = companyData?.subscription_tier === 'enterprise' ? 100 :
                    companyData?.subscription_tier === 'professional' ? 20 : 5;
        }
        
        setTechnicianLimit(maxTechs || 5); // Default to 5 if all else fails
        setTechnicians(technicianUsers);
        setInvites(pendingInvites);
        
      } catch (err) {
        console.error('Error fetching technician data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load technician data');
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchData();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewTechnician(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddTechnician = async () => {
    // Validation
    if (!newTechnician.name || !newTechnician.email) {
      toast.error("Name and email are required");
      return;
    }

    // Check if we've reached the maximum number of technicians
    const totalCount = technicians.length + invites.length;
    if (totalCount >= technicianLimit) {
      toast.error(`Your plan only allows ${technicianLimit} technicians. Please upgrade to add more.`);
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Get current user for creating the invitation
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('No authenticated user found');
      }
      
      // Get company ID
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('company_id')
        .eq('id', user.id)
        .single();
        
      if (userError) {
        throw userError;
      }
      
      if (!userData?.company_id) {
        throw new Error('No company ID found for user');
      }
      
      // Create the invitation
      const { data: inviteData, error: inviteError } = await supabase
        .from('technician_invites')
        .insert([
          {
            name: newTechnician.name,
            email: newTechnician.email,
            phone: newTechnician.phone || null,
            company_id: userData.company_id,
            created_by: user.id,
            status: 'pending',
            expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days from now
          }
        ])
        .select()
        .single();
      
      if (inviteError) {
        throw inviteError;
      }
      
      // Add to local state
      const newInvite: TechnicianInvite = {
        id: inviteData.id,
        email: inviteData.email,
        name: inviteData.name,
        phone: inviteData.phone || undefined,
        companyId: inviteData.company_id,
        status: inviteData.status,
        createdAt: new Date(inviteData.created_at),
        expiresAt: new Date(inviteData.expires_at)
      };
      
      setInvites([...invites, newInvite]);
      setNewTechnician({ name: "", email: "", phone: "" });
      setIsAddDialogOpen(false);
      toast.success("Invitation sent successfully");
      
    } catch (err) {
      console.error('Error sending invitation:', err);
      toast.error("Failed to send invitation: " + (err instanceof Error ? err.message : "Unknown error"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelInvite = async (inviteId: string) => {
    try {
      const { error } = await supabase
        .from('technician_invites')
        .update({ status: 'cancelled' })
        .eq('id', inviteId);
        
      if (error) {
        throw error;
      }
      
      setInvites(invites.filter(invite => invite.id !== inviteId));
      toast.success("Invitation canceled");
    } catch (err) {
      console.error('Error canceling invitation:', err);
      toast.error("Failed to cancel invitation: " + (err instanceof Error ? err.message : "Unknown error"));
    }
  };

  const handleRemoveTechnician = async (techId: string) => {
    try {
      const { error } = await supabase
        .from('technicians')
        .update({ status: 'inactive' })
        .eq('id', techId);
        
      if (error) {
        throw error;
      }
      
      // Update local state
      setTechnicians(technicians.map(tech => 
        tech.id === techId ? { ...tech, status: 'inactive' } : tech
      ));
      
      toast.success("Technician removed successfully");
    } catch (err) {
      console.error('Error removing technician:', err);
      toast.error("Failed to remove technician: " + (err instanceof Error ? err.message : "Unknown error"));
    }
  };

  // Calculate technicians usage
  const activeCount = technicians.filter(t => t.status !== 'inactive').length;
  const pendingCount = invites.length;
  const totalCount = activeCount + pendingCount;
  const isAtLimit = totalCount >= technicianLimit;

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-48 mt-2" />
          </div>
          <Skeleton className="h-10 w-32" />
        </div>
        
        <Skeleton className="h-24 w-full mb-6" />
        
        <Skeleton className="h-4 w-32 mb-4" />
        
        <Skeleton className="h-64 w-full mb-6" />
        
        <Skeleton className="h-4 w-32 mb-4" />
        
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {error}
            <Button 
              variant="outline" 
              className="mt-2"
              onClick={() => window.location.reload()}
            >
              Try Again
            </Button>
          </AlertDescription>
        </Alert>
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
          disabled={isAtLimit}
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
                {activeCount} active + {pendingCount} pending = {totalCount} total of {technicianLimit} allowed
              </p>
            </div>
            {isAtLimit && (
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
                {technicians.filter(tech => tech.status !== 'inactive').map((tech) => (
                  <div key={tech.id} className="flex items-center justify-between p-4 border rounded-lg bg-green-50 border-green-100">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center mr-4">
                        {tech.avatarUrl ? (
                          <img 
                            src={tech.avatarUrl} 
                            alt={tech.name} 
                            className="w-10 h-10 rounded-full object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(tech.name || 'User')}&background=random`;
                            }}
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
                      </div>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleRemoveTechnician(tech.id)}
                    >
                      <X className="h-4 w-4 text-red-500" />
                    </Button>
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
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button onClick={handleAddTechnician} disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  "Send Invitation"
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
