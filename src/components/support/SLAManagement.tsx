
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useSLATracking, SLAPolicy } from '@/hooks/useSLATracking';
import { Clock, Plus, Edit, AlertTriangle } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface SLAManagementProps {
  companyId: string;
}

export function SLAManagement({ companyId }: SLAManagementProps) {
  const { slaPolices, createSLAPolicy, updateSLAPolicy, isLoading } = useSLATracking(companyId);
  const { toast } = useToast();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingPolicy, setEditingPolicy] = useState<SLAPolicy | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    priority: 'medium' as 'low' | 'medium' | 'high' | 'critical',
    response_time: 240, // 4 hours in minutes
    resolution_time: 1440, // 24 hours in minutes
  });

  const handleAddPolicy = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createSLAPolicy({
        ...formData,
        company_id: companyId,
        is_active: true,
      });
      setIsAddDialogOpen(false);
      setFormData({
        name: '',
        priority: 'medium',
        response_time: 240,
        resolution_time: 1440,
      });
      toast({
        title: 'SLA policy created',
        description: 'New SLA policy has been created successfully.',
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to create SLA policy. Please try again.',
      });
    }
  };

  const handleUpdatePolicy = async (policyId: string, updates: Partial<SLAPolicy>) => {
    try {
      await updateSLAPolicy(policyId, updates);
      setEditingPolicy(null);
      toast({
        title: 'SLA policy updated',
        description: 'SLA policy has been updated successfully.',
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to update SLA policy. Please try again.',
      });
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low': return 'bg-gray-100 text-gray-800';
      case 'medium': return 'bg-blue-100 text-blue-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'critical': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatTime = (minutes: number) => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">SLA Management</h2>
          <p className="text-muted-foreground">Configure service level agreements for different priority levels</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add SLA Policy
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New SLA Policy</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddPolicy} className="space-y-4">
              <div>
                <Label htmlFor="name">Policy Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., High Priority SLA"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="priority">Priority Level</Label>
                <Select value={formData.priority} onValueChange={(value) => setFormData({ ...formData, priority: value as any })}>
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

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="response_time">Response Time (minutes)</Label>
                  <Input
                    id="response_time"
                    type="number"
                    min="1"
                    value={formData.response_time}
                    onChange={(e) => setFormData({ ...formData, response_time: parseInt(e.target.value) })}
                  />
                </div>
                <div>
                  <Label htmlFor="resolution_time">Resolution Time (minutes)</Label>
                  <Input
                    id="resolution_time"
                    type="number"
                    min="1"
                    value={formData.resolution_time}
                    onChange={(e) => setFormData({ ...formData, resolution_time: parseInt(e.target.value) })}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading}>
                  Create Policy
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {slaPolices.map((policy) => (
          <Card key={policy.id}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{policy.name}</CardTitle>
                  <Badge className={getPriorityColor(policy.priority)}>
                    {policy.priority} priority
                  </Badge>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setEditingPolicy(policy)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-medium">Response Time</span>
                  </div>
                  <p className="text-lg font-bold text-blue-600">
                    {formatTime(policy.response_time)}
                  </p>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-orange-600" />
                    <span className="text-sm font-medium">Resolution Time</span>
                  </div>
                  <p className="text-lg font-bold text-orange-600">
                    {formatTime(policy.resolution_time)}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t">
                <Badge variant={policy.is_active ? "default" : "secondary"}>
                  {policy.is_active ? 'Active' : 'Inactive'}
                </Badge>
                <p className="text-xs text-muted-foreground">
                  Updated {new Date(policy.updated_at).toLocaleDateString()}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {slaPolices.length === 0 && !isLoading && (
        <Card>
          <CardContent className="text-center py-12">
            <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No SLA policies configured</h3>
            <p className="text-muted-foreground mb-4">Create your first SLA policy to track response and resolution times</p>
            <Button onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add SLA Policy
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Edit Policy Dialog */}
      {editingPolicy && (
        <Dialog open={!!editingPolicy} onOpenChange={() => setEditingPolicy(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit SLA Policy</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Policy Name</Label>
                <Input
                  defaultValue={editingPolicy.name}
                  onChange={(e) => setEditingPolicy({ ...editingPolicy, name: e.target.value })}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Response Time (minutes)</Label>
                  <Input
                    type="number"
                    min="1"
                    defaultValue={editingPolicy.response_time}
                    onChange={(e) => setEditingPolicy({ ...editingPolicy, response_time: parseInt(e.target.value) })}
                  />
                </div>
                <div>
                  <Label>Resolution Time (minutes)</Label>
                  <Input
                    type="number"
                    min="1"
                    defaultValue={editingPolicy.resolution_time}
                    onChange={(e) => setEditingPolicy({ ...editingPolicy, resolution_time: parseInt(e.target.value) })}
                  />
                </div>
              </div>

              <div>
                <Label>Status</Label>
                <Select 
                  defaultValue={editingPolicy.is_active ? 'active' : 'inactive'}
                  onValueChange={(value) => setEditingPolicy({ ...editingPolicy, is_active: value === 'active' })}
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
                <Button variant="outline" onClick={() => setEditingPolicy(null)}>
                  Cancel
                </Button>
                <Button onClick={() => handleUpdatePolicy(editingPolicy.id, editingPolicy)}>
                  Update Policy
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
