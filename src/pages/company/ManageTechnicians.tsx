
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { User, TechnicianInvite } from "@/types/user";
import { SubscriptionPlan, License } from "@/types/subscription";
import { mockSubscriptionPlans, mockLicenses } from "@/data/mockSubscriptions";
import { Plus, Mail, Phone, User as UserIcon, AlertCircle, Clock, Check, X, Archive } from "lucide-react";
import { toast } from "sonner";
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

// Mock data for technicians
const mockTechnicians: User[] = [
  {
    id: "tech-1",
    name: "John Technician",
    email: "john.tech@example.com",
    phone: "555-123-4567",
    role: "tech",
    companyId: "company-2",
    avatarUrl: "/lovable-uploads/894f58ab-c3aa-45ba-9ea3-e3a2d9ddf247.png"
  },
  {
    id: "tech-2",
    name: "Sarah Repair",
    email: "sarah.repair@example.com",
    phone: "555-987-6543",
    role: "tech",
    companyId: "company-2"
  }
];

// Mock data for pending invites
const mockInvites: TechnicianInvite[] = [
  {
    id: "invite-1",
    email: "pending.tech@example.com",
    name: "Pending Technician",
    phone: "555-555-5555",
    companyId: "company-2",
    status: "pending",
    createdAt: new Date(Date.now() - 86400000), // 1 day ago
    expiresAt: new Date(Date.now() + 86400000 * 6) // 6 days from now
  }
];

export default function ManageTechnicians() {
  const [technicians, setTechnicians] = useState<User[]>(mockTechnicians);
  const [invites, setInvites] = useState<TechnicianInvite[]>(mockInvites);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newTechnician, setNewTechnician] = useState({
    name: "",
    email: "",
    phone: ""
  });
  const [currentLicense, setCurrentLicense] = useState<License | undefined>();
  const [currentPlan, setCurrentPlan] = useState<SubscriptionPlan | undefined>();
  
  // New states for delete/archive confirmation
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [techToDelete, setTechToDelete] = useState<string | null>(null);
  
  // Load the current license and plan info
  useEffect(() => {
    // In a real app, we would fetch this from an API
    const license = mockLicenses.find(l => l.companyId === "company-2");
    setCurrentLicense(license);
    
    if (license) {
      const plan = mockSubscriptionPlans.find(p => p.id === license.planId);
      setCurrentPlan(plan);
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewTechnician(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddTechnician = () => {
    // Validation
    if (!newTechnician.name || !newTechnician.email) {
      toast.error("Name and email are required");
      return;
    }

    // Check if we've reached the maximum number of technicians
    if (currentPlan && technicians.length >= currentPlan.maxTechnicians) {
      toast.error(`Your plan only allows ${currentPlan.maxTechnicians} technicians. Please upgrade to add more.`);
      return;
    }

    // In a real app, this would send an invitation email
    const newInvite: TechnicianInvite = {
      id: `invite-${Date.now()}`,
      email: newTechnician.email,
      name: newTechnician.name,
      phone: newTechnician.phone || undefined,
      companyId: "company-2",
      status: "pending",
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 86400000 * 7) // 7 days from now
    };
    
    setInvites([...invites, newInvite]);
    setNewTechnician({ name: "", email: "", phone: "" });
    setIsAddDialogOpen(false);
    toast.success("Invitation sent successfully");
  };

  const handleCancelInvite = (inviteId: string) => {
    setInvites(invites.filter(invite => invite.id !== inviteId));
    toast.success("Invitation canceled");
  };

  // Show confirmation dialog before deleting
  const confirmDeleteTechnician = (techId: string) => {
    setTechToDelete(techId);
    setIsDeleteDialogOpen(true);
  };

  // Actually delete the technician after confirmation
  const handleDeleteTechnician = () => {
    if (!techToDelete) return;
    
    setTechnicians(technicians.filter(tech => tech.id !== techToDelete));
    setIsDeleteDialogOpen(false);
    setTechToDelete(null);
    toast.success("Technician removed successfully");
  };

  // New archive function
  const handleArchiveTechnician = (techId: string) => {
    // In a real app, you would update the technician's status in the database
    // Here we'll just update our local state to simulate archiving
    setTechnicians(technicians.map(tech => {
      if (tech.id === techId) {
        return { ...tech, status: "archived" };
      }
      return tech;
    }));
    toast.success("Technician archived successfully");
  };

  // Calculate technicians usage
  const technicianLimit = currentPlan?.maxTechnicians || 0;
  const activeCount = technicians.length;
  const pendingCount = invites.filter(i => i.status === "pending").length;
  const totalCount = activeCount + pendingCount;
  const isAtLimit = totalCount >= technicianLimit;

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

      {currentPlan && (
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
      )}

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

      {/* Add technician dialog */}
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

      {/* Delete confirmation dialog */}
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
