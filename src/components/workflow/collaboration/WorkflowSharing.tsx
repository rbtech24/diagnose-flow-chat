
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Share2, 
  Users, 
  Mail, 
  Copy, 
  Link, 
  Eye,
  Edit,
  Shield,
  Clock,
  Check
} from 'lucide-react';
import { SavedWorkflow } from '@/utils/flow/types';
import { toast } from '@/hooks/use-toast';

interface SharePermission {
  id: string;
  email: string;
  role: 'viewer' | 'editor' | 'admin';
  status: 'pending' | 'accepted' | 'declined';
  sharedAt: Date;
}

interface WorkflowSharingProps {
  workflow: SavedWorkflow;
  currentPermissions?: SharePermission[];
  onUpdatePermissions?: (permissions: SharePermission[]) => void;
}

export function WorkflowSharing({ 
  workflow, 
  currentPermissions = [],
  onUpdatePermissions 
}: WorkflowSharingProps) {
  const [shareEmail, setShareEmail] = useState('');
  const [shareRole, setShareRole] = useState<'viewer' | 'editor' | 'admin'>('viewer');
  const [shareMessage, setShareMessage] = useState('');
  const [isSharing, setIsSharing] = useState(false);
  const [shareLink, setShareLink] = useState('');
  const [linkPermission, setLinkPermission] = useState<'viewer' | 'editor'>('viewer');

  const handleShareWithUser = async () => {
    if (!shareEmail.trim()) {
      toast({
        title: "Email Required",
        description: "Please enter an email address to share with",
        variant: "destructive"
      });
      return;
    }

    setIsSharing(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newPermission: SharePermission = {
        id: Math.random().toString(36).substr(2, 9),
        email: shareEmail,
        role: shareRole,
        status: 'pending',
        sharedAt: new Date()
      };

      const updatedPermissions = [...currentPermissions, newPermission];
      onUpdatePermissions?.(updatedPermissions);
      
      setShareEmail('');
      setShareMessage('');
      
      toast({
        title: "Invitation Sent",
        description: `Workflow shared with ${shareEmail} as ${shareRole}`
      });
    } catch (error) {
      toast({
        title: "Share Failed",
        description: "Failed to share workflow. Please try again.",
        variant: "destructive"
      });
    }
    
    setIsSharing(false);
  };

  const generateShareLink = () => {
    const linkId = Math.random().toString(36).substr(2, 12);
    const generatedLink = `${window.location.origin}/workflow/shared/${linkId}?permission=${linkPermission}`;
    setShareLink(generatedLink);
    
    toast({
      title: "Share Link Generated",
      description: "Link copied to clipboard",
    });
    
    navigator.clipboard.writeText(generatedLink);
  };

  const copyShareLink = () => {
    navigator.clipboard.writeText(shareLink);
    toast({
      title: "Link Copied",
      description: "Share link copied to clipboard"
    });
  };

  const removePermission = (permissionId: string) => {
    const updatedPermissions = currentPermissions.filter(p => p.id !== permissionId);
    onUpdatePermissions?.(updatedPermissions);
    
    toast({
      title: "Access Removed",
      description: "User access has been revoked"
    });
  };

  const updatePermissionRole = (permissionId: string, newRole: 'viewer' | 'editor' | 'admin') => {
    const updatedPermissions = currentPermissions.map(p => 
      p.id === permissionId ? { ...p, role: newRole } : p
    );
    onUpdatePermissions?.(updatedPermissions);
    
    toast({
      title: "Permission Updated",
      description: `User role updated to ${newRole}`
    });
  };

  const roleIcons = {
    viewer: <Eye className="w-4 h-4" />,
    editor: <Edit className="w-4 h-4" />,
    admin: <Shield className="w-4 h-4" />
  };

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    accepted: 'bg-green-100 text-green-800',
    declined: 'bg-red-100 text-red-800'
  };

  return (
    <div className="space-y-6">
      {/* Share with Specific Users */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Share with Team Members
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="text-sm font-medium">Email Address</label>
              <Input
                type="email"
                placeholder="colleague@company.com"
                value={shareEmail}
                onChange={(e) => setShareEmail(e.target.value)}
              />
            </div>
            
            <div>
              <label className="text-sm font-medium">Permission Level</label>
              <Select value={shareRole} onValueChange={(value: any) => setShareRole(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="viewer">
                    <div className="flex items-center gap-2">
                      <Eye className="w-4 h-4" />
                      Viewer - Can view and execute
                    </div>
                  </SelectItem>
                  <SelectItem value="editor">
                    <div className="flex items-center gap-2">
                      <Edit className="w-4 h-4" />
                      Editor - Can view and edit
                    </div>
                  </SelectItem>
                  <SelectItem value="admin">
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4" />
                      Admin - Full control
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-end">
              <Button 
                onClick={handleShareWithUser}
                disabled={isSharing || !shareEmail.trim()}
                className="w-full flex items-center gap-2"
              >
                {isSharing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Sharing...
                  </>
                ) : (
                  <>
                    <Mail className="w-4 h-4" />
                    Send Invite
                  </>
                )}
              </Button>
            </div>
          </div>
          
          <div>
            <label className="text-sm font-medium">Optional Message</label>
            <Textarea
              placeholder="Add a message to the invitation..."
              value={shareMessage}
              onChange={(e) => setShareMessage(e.target.value)}
              rows={2}
            />
          </div>
        </CardContent>
      </Card>

      {/* Share Link */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Link className="w-5 h-5" />
            Share Link
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium">Link Permission</label>
              <Select value={linkPermission} onValueChange={(value: any) => setLinkPermission(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="viewer">Viewer Access</SelectItem>
                  <SelectItem value="editor">Editor Access</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-end">
              <Button 
                onClick={generateShareLink}
                variant="outline"
                className="w-full flex items-center gap-2"
              >
                <Share2 className="w-4 h-4" />
                Generate Link
              </Button>
            </div>
          </div>
          
          {shareLink && (
            <div className="flex gap-2">
              <Input
                value={shareLink}
                readOnly
                className="font-mono text-xs"
              />
              <Button onClick={copyShareLink} variant="outline" size="sm">
                <Copy className="w-4 h-4" />
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Current Permissions */}
      <Card>
        <CardHeader>
          <CardTitle>Current Access</CardTitle>
        </CardHeader>
        <CardContent>
          {currentPermissions.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Users className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>No shared access yet</p>
              <p className="text-sm">Share this workflow to collaborate with others</p>
            </div>
          ) : (
            <div className="space-y-3">
              {currentPermissions.map((permission) => (
                <div key={permission.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                      <Users className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-medium">{permission.email}</p>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Clock className="w-3 h-3" />
                        Shared {permission.sharedAt.toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Badge className={statusColors[permission.status]}>
                      {permission.status === 'accepted' && <Check className="w-3 h-3 mr-1" />}
                      {permission.status}
                    </Badge>
                    
                    <Select 
                      value={permission.role} 
                      onValueChange={(value: any) => updatePermissionRole(permission.id, value)}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="viewer">
                          <div className="flex items-center gap-2">
                            {roleIcons.viewer}
                            Viewer
                          </div>
                        </SelectItem>
                        <SelectItem value="editor">
                          <div className="flex items-center gap-2">
                            {roleIcons.editor}
                            Editor
                          </div>
                        </SelectItem>
                        <SelectItem value="admin">
                          <div className="flex items-center gap-2">
                            {roleIcons.admin}
                            Admin
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removePermission(permission.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
