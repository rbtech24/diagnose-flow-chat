
import { useState } from 'react';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Save } from 'lucide-react';
import { useAppliances } from '@/hooks/useAppliances';
import { getFolders } from '@/utils/flowUtils';

interface SaveWorkflowDialogProps {
  onSave: (name: string, folder: string) => void;
}

export function SaveWorkflowDialog({ onSave }: SaveWorkflowDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [workflowName, setWorkflowName] = useState('');
  const [selectedAppliance, setSelectedAppliance] = useState('');
  const [newFolder, setNewFolder] = useState('');
  const { appliances } = useAppliances();
  const existingFolders = getFolders();
  
  const allFolders = [...new Set([
    ...appliances.map(a => a.name),
    ...existingFolders
  ])];

  const handleSave = () => {
    const folder = newFolder || selectedAppliance;
    if (!workflowName || !folder) {
      return;
    }
    onSave(workflowName, folder);
    setIsOpen(false);
    setWorkflowName('');
    setNewFolder('');
    setSelectedAppliance('');
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
              value={selectedAppliance}
              onChange={(e) => {
                setSelectedAppliance(e.target.value);
                setNewFolder('');
              }}
            >
              <option value="">Select a folder...</option>
              {allFolders.map((folder) => (
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
                setSelectedAppliance('');
              }}
              placeholder="Enter new folder name"
            />
          </div>

          <Button 
            className="w-full" 
            onClick={handleSave}
            disabled={!workflowName || (!newFolder && !selectedAppliance)}
          >
            Save
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
