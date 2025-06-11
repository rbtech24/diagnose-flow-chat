
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useSupportTeam } from '@/hooks/useSupportTeam';
import { UserPlus, Edit, Trash2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface SupportTeamManagementProps {
  companyId: string;
}

export function SupportTeamManagement({ companyId }: SupportTeamManagementProps) {
  const { teamMembers, isLoading, addTeamMember, updateTeamMember } = useSupportTeam(companyId);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<any>(null);
  const [newMemberData, setNewMemberData] = useState({
    name: '',
    email: '',
    role: 'agent' as 'agent' | 'supervisor' | 'manager',
    department: '',
    max_tickets: 10
  });

  const handleAddMember = async () => {
    try {
      await addTeamMember(newMemberData);
      setIsAddDialogOpen(false);
      setNewMemberData({
        name: '',
        email: '',
        role: 'agent',
        department: '',
        max_tickets: 10
      });
    } catch (error) {
      console.error('Error adding team member:', error);
    }
  };

  const handleUpdateMember = async () => {
    if (!selectedMember) return;
    
    try {
      await updateTeamMember(selectedMember.id, selectedMember);
      setIsEditDialogOpen(false);
      setSelectedMember(null);
    } catch (error) {
      console.error('Error updating team member:', error);
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

  if (isLoading) {
    return (
      <div className="p-6">
        <p className="text-center text-muted-foreground">Loading team members...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Support Team Members</h3>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <UserPlus className="h-4 w-4 mr-2" />
              Add Member
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Team Member</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={newMemberData.name}
                  onChange={(e) => setNewMemberData({ ...newMemberData, name: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={newMemberData.email}
                  onChange={(e) => setNewMemberData({ ...newMemberData, email: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="role">Role</Label>
                <Select 
                  value={newMemberData.role} 
                  onValueChange={(value: any) => setNewMemberData({ ...newMemberData, role: value })}
                >
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
                  value={newMemberData.department}
                  onChange={(e) => setNewMemberData({ ...newMemberData, department: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="maxTickets">Max Tickets</Label>
                <Input
                  id="maxTickets"
                  type="number"
                  value={newMemberData.max_tickets}
                  onChange={(e) => setNewMemberData({ ...newMemberData, max_tickets: parseInt(e.target.value) })}
                />
              </div>
              <Button onClick={handleAddMember} className="w-full">
                Add Member
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {teamMembers.map((member) => (
          <Card key={member.id}>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-base">{member.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">{member.email}</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSelectedMember(member);
                    setIsEditDialogOpen(true);
                  }}
                >
                  <Edit className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Role</span>
                  <Badge className={getRoleColor(member.role)}>
                    {member.role}
                  </Badge>
                </div>
                {member.department && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Department</span>
                    <span className="text-sm">{member.department}</span>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Tickets</span>
                  <span className="text-sm">{member.current_tickets}/{member.max_tickets}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Status</span>
                  <Badge variant={member.is_active ? 'outline' : 'secondary'}>
                    {member.is_active ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Edit Member Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Team Member</DialogTitle>
          </DialogHeader>
          {selectedMember && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="editName">Name</Label>
                <Input
                  id="editName"
                  value={selectedMember.name}
                  onChange={(e) => setSelectedMember({ ...selectedMember, name: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="editEmail">Email</Label>
                <Input
                  id="editEmail"
                  type="email"
                  value={selectedMember.email}
                  onChange={(e) => setSelectedMember({ ...selectedMember, email: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="editRole">Role</Label>
                <Select 
                  value={selectedMember.role} 
                  onValueChange={(value: any) => setSelectedMember({ ...selectedMember, role: value })}
                >
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
                <Label htmlFor="editDepartment">Department</Label>
                <Input
                  id="editDepartment"
                  value={selectedMember.department || ''}
                  onChange={(e) => setSelectedMember({ ...selectedMember, department: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="editMaxTickets">Max Tickets</Label>
                <Input
                  id="editMaxTickets"
                  type="number"
                  value={selectedMember.max_tickets}
                  onChange={(e) => setSelectedMember({ ...selectedMember, max_tickets: parseInt(e.target.value) })}
                />
              </div>
              <Button onClick={handleUpdateMember} className="w-full">
                Update Member
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
