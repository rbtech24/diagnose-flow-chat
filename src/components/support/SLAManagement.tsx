
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useSLATracking } from '@/hooks/useSLATracking';
import { Plus, Edit, Clock } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface SLAManagementProps {
  companyId: string;
}

export function SLAManagement({ companyId }: SLAManagementProps) {
  const { slaPolices, isLoading, createSLAPolicy, updateSLAPolicy } = useSLATracking(companyId);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedPolicy, setSelectedPolicy] = useState<any>(null);
  const [newPolicyData, setNewPolicyData] = useState({
    name: '',
    priority: 'medium' as 'low' | 'medium' | 'high' | 'critical',
    response_time: 60, // minutes
    resolution_time: 240, // minutes
  });

  const handleCreatePolicy = async () => {
    try {
      await createSLAPolicy({
        ...newPolicyData,
        company_id: companyId,
        is_active: true
      });
      setIsCreateDialogOpen(false);
      setNewPolicyData({
        name: '',
        priority: 'medium',
        response_time: 60,
        resolution_time: 240,
      });
    } catch (error) {
      console.error('Error creating SLA policy:', error);
    }
  };

  const handleUpdatePolicy = async () => {
    if (!selectedPolicy) return;
    
    try {
      await updateSLAPolicy(selectedPolicy.id, selectedPolicy);
      setIsEditDialogOpen(false);
      setSelectedPolicy(null);
    } catch (error) {
      console.error('Error updating SLA policy:', error);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-blue-100 text-blue-800';
      case 'low': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <p className="text-center text-muted-foreground">Loading SLA policies...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">SLA Policies</h3>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Policy
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create SLA Policy</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Policy Name</Label>
                <Input
                  id="name"
                  value={newPolicyData.name}
                  onChange={(e) => setNewPolicyData({ ...newPolicyData, name: e.target.value })}
                  placeholder="e.g., Standard Support"
                />
              </div>
              <div>
                <Label htmlFor="priority">Priority Level</Label>
                <Select 
                  value={newPolicyData.priority} 
                  onValueChange={(value: any) => setNewPolicyData({ ...newPolicyData, priority: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="responseTime">Response Time (minutes)</Label>
                <Input
                  id="responseTime"
                  type="number"
                  value={newPolicyData.response_time}
                  onChange={(e) => setNewPolicyData({ ...newPolicyData, response_time: parseInt(e.target.value) })}
                />
              </div>
              <div>
                <Label htmlFor="resolutionTime">Resolution Time (minutes)</Label>
                <Input
                  id="resolutionTime"
                  type="number"
                  value={newPolicyData.resolution_time}
                  onChange={(e) => setNewPolicyData({ ...newPolicyData, resolution_time: parseInt(e.target.value) })}
                />
              </div>
              <Button onClick={handleCreatePolicy} className="w-full">
                Create Policy
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {slaPolices.map((policy) => (
          <Card key={policy.id}>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-base">{policy.name}</CardTitle>
                  <Badge className={getPriorityColor(policy.priority)}>
                    {policy.priority} priority
                  </Badge>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSelectedPolicy(policy);
                    setIsEditDialogOpen(true);
                  }}
                >
                  <Edit className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Response: {formatTime(policy.response_time)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Resolution: {formatTime(policy.resolution_time)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Status</span>
                  <Badge variant={policy.is_active ? 'outline' : 'secondary'}>
                    {policy.is_active ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {slaPolices.length === 0 && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No SLA policies configured</p>
        </div>
      )}

      {/* Edit Policy Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit SLA Policy</DialogTitle>
          </DialogHeader>
          {selectedPolicy && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="editName">Policy Name</Label>
                <Input
                  id="editName"
                  value={selectedPolicy.name}
                  onChange={(e) => setSelectedPolicy({ ...selectedPolicy, name: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="editPriority">Priority Level</Label>
                <Select 
                  value={selectedPolicy.priority} 
                  onValueChange={(value: any) => setSelectedPolicy({ ...selectedPolicy, priority: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="editResponseTime">Response Time (minutes)</Label>
                <Input
                  id="editResponseTime"
                  type="number"
                  value={selectedPolicy.response_time}
                  onChange={(e) => setSelectedPolicy({ ...selectedPolicy, response_time: parseInt(e.target.value) })}
                />
              </div>
              <div>
                <Label htmlFor="editResolutionTime">Resolution Time (minutes)</Label>
                <Input
                  id="editResolutionTime"
                  type="number"
                  value={selectedPolicy.resolution_time}
                  onChange={(e) => setSelectedPolicy({ ...selectedPolicy, resolution_time: parseInt(e.target.value) })}
                />
              </div>
              <Button onClick={handleUpdatePolicy} className="w-full">
                Update Policy
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
