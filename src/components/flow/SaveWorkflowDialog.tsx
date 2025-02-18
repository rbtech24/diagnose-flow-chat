
import { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Save } from 'lucide-react';
import { useAppliances } from '@/hooks/useAppliances';
import { getFolders } from '@/utils/flow';
import { useLocation } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

interface SaveWorkflowDialogProps {
  onSave: (name: string, folder: string) => Promise<void>;
}

export function SaveWorkflowDialog({ onSave }: SaveWorkflowDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [workflowName, setWorkflowName] = useState('');
  const [selectedFolder, setSelectedFolder] = useState('Default');
  const [newFolder, setNewFolder] = useState('');
  const [folders, setFolders] = useState<string[]>([]);
  const { appliances } = useAppliances();
  const location = useLocation();
  
  const isWorkflowsPage = location.pathname === '/workflows';
  
  useEffect(() => {
    if (isOpen) {
      const existingFolders = getFolders();
      const availableFolders = isWorkflowsPage 
        ? existingFolders 
        : [...new Set([...appliances.map(a => a.name), ...existingFolders])];
      setFolders(availableFolders);
    }
  }, [isOpen, isWorkflowsPage, appliances]);

  const handleSave = async () => {
    if (!workflowName) {
      toast({
        title: "Validation Error",
        description: "Please provide a workflow name",
        variant: "destructive"
      });
      return;
    }

    const targetFolder = newFolder || selectedFolder;
    
    try {
      console.log('Saving workflow:', {
        name: workflowName,
        folder: targetFolder
      });
      
      await onSave(workflowName, targetFolder);
      setIsOpen(false);
      setWorkflowName('');
      setNewFolder('');
      setSelectedFolder('Default');
    } catch (error) {
      console.error('Error saving workflow:', error);
      toast({
        title: "Error",
        description: "Failed to save the workflow. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="secondary" className="flex items-center gap-2">
          <Save className="w-4 h-4" />
          Save Workflow
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Save Workflow</DialogTitle>
          <DialogDescription>
            Save your workflow to an existing folder or create a new one.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="workflowName">Workflow Name</Label>
            <Input
              id="workflowName"
              value={workflowName}
              onChange={(e) => setWorkflowName(e.target.value)}
              placeholder="Enter workflow name"
            />
          </div>
          
          <div className="space-y-2">
            <Label>Save to Folder</Label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              value={selectedFolder}
              onChange={(e) => {
                setSelectedFolder(e.target.value);
                setNewFolder('');
              }}
            >
              {folders.map((folder) => (
                <option key={folder} value={folder}>
                  {folder}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="newFolder">Or Create New Folder</Label>
            <Input
              id="newFolder"
              value={newFolder}
              onChange={(e) => {
                setNewFolder(e.target.value);
                setSelectedFolder('Default');
              }}
              placeholder="Enter new folder name"
            />
          </div>

          <Button 
            className="w-full" 
            onClick={handleSave}
            disabled={!workflowName}
          >
            Save
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
