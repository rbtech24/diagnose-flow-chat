
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useSupportTeam, SupportTeamMember } from '@/hooks/useSupportTeam';
import { UserPlus, Edit, Users, Mail, Phone } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface SupportTeamManagementProps {
  companyId: string;
}

export function SupportTeamManagement({ companyId }: SupportTeamManagementProps) {
  const { teamMembers, addTeamMember, updateTeamMember, isLoading } = useSupportTeam(companyId);
  const { toast } = useToast();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<SupportTeamMember | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'agent' as 'agent' | 'supervisor' | 'manager',
    department: '',
    max_tickets: 10,
    specializations: [] as string[],
  });

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addTeamMember(formData);
      setIsAddDialogOpen(false);
      setFormData({
        name: '',
        email: '',
        role: 'agent',
        department: '',
        max_tickets: 10,
        specializations: [],
      });
      toast({
        title: 'Team member added',
        description: 'New support team member has been added successfully.',
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to add team member. Please try again.',
      });
    }
  };

  const handleUpdateMember = async (memberId: string, updates: Partial<SupportTeamMember>) => {
    try {
      await updateTeamMember(memberId, updates);
      setEditingMember(null);
      toast({
        title: 'Team member updated',
        description: 'Team member details have been updated successfully.',
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to update team member. Please try again.',
      });
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'manager': return 'bg-purple-100 text-purple-800';
      case 'supervisor': return 'bg-blue-100 text-blue-800';
      case 'agent': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getWorkloadColor = (current: number, max: number) => {
    const percentage = (current / max) * 100;
    if (percentage >= 90) return 'text-red-600';
    if (percentage >= 70) return 'text-yellow-600';
    return 'text-green-600';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Support Team Management</h2>
          <p className="text-muted-foreground">Manage your support team members and their assignments</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <UserPlus className="h-4 w-4 mr-2" />
              Add Team Member
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Team Member</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddMember} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="role">Role</Label>
                  <Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value as any })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="agent">Agent</SelectItem>
                      <SelectItem value="supervisor">Supervisor</SelectItem>
                      <SelectItem value="manager">Manager</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="department">Department</Label>
                  <Input
                    id="department"
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="max_tickets">Maximum Tickets</Label>
                <Input
                  id="max_tickets"
                  type="number"
                  min="1"
                  value={formData.max_tickets}
                  onChange={(e) => setFormData({ ...formData, max_tickets: parseInt(e.target.value) })}
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading}>
                  Add Member
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {teamMembers.map((member) => (
          <Card key={member.id}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{member.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">{member.email}</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setEditingMember(member)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <Badge className={getRoleColor(member.role)}>
                  {member.role}
                </Badge>
                <Badge variant={member.is_active ? "default" : "secondary"}>
                  {member.is_active ? 'Active' : 'Inactive'}
                </Badge>
              </div>

              {member.department && (
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{member.department}</span>
                </div>
              )}

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Workload</span>
                  <span className={`text-sm font-medium ${getWorkloadColor(member.current_tickets, member.max_tickets)}`}>
                    {member.current_tickets}/{member.max_tickets}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full" 
                    style={{ width: `${Math.min((member.current_tickets / member.max_tickets) * 100, 100)}%` }}
                  />
                </div>
              </div>

              {member.specializations.length > 0 && (
                <div>
                  <p className="text-sm font-medium mb-1">Specializations</p>
                  <div className="flex flex-wrap gap-1">
                    {member.specializations.map((spec, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {spec}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {teamMembers.length === 0 && !isLoading && (
        <Card>
          <CardContent className="text-center py-12">
            <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No team members yet</h3>
            <p className="text-muted-foreground mb-4">Add your first support team member to get started</p>
            <Button onClick={() => setIsAddDialogOpen(true)}>
              <UserPlus className="h-4 w-4 mr-2" />
              Add Team Member
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Edit Member Dialog */}
      {editingMember && (
        <Dialog open={!!editingMember} onOpenChange={() => setEditingMember(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Team Member</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Max Tickets</Label>
                <Input
                  type="number"
                  min="1"
                  defaultValue={editingMember.max_tickets}
                  onChange={(e) => {
                    const value = parseInt(e.target.value);
                    setEditingMember({ ...editingMember, max_tickets: value });
                  }}
                />
              </div>
              
              <div>
                <Label>Status</Label>
                <Select 
                  defaultValue={editingMember.is_active ? 'active' : 'inactive'}
                  onValueChange={(value) => {
                    setEditingMember({ ...editingMember, is_active: value === 'active' });
                  }}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setEditingMember(null)}>
                  Cancel
                </Button>
                <Button onClick={() => handleUpdateMember(editingMember.id, editingMember)}>
                  Update Member
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
