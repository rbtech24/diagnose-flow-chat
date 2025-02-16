
import { useState } from 'react';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Save } from 'lucide-react';
import { getFolders } from '@/utils/flowUtils';

interface SaveWorkflowDialogProps {
  onSave: (name: string, folder: string) => void;
}

export function SaveWorkflowDialog({ onSave }: SaveWorkflowDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [workflowName, setWorkflowName] = useState('');
  const [folderName, setFolderName] = useState('');
  const [newFolder, setNewFolder] = useState('');
  const existingFolders = getFolders();

  const handleSave = () => {
    const folder = newFolder || folderName;
    if (!workflowName || !folder) {
      return;
    }
    onSave(workflowName, folder);
    setIsOpen(false);
    setWorkflowName('');
    setFolderName('');
    setNewFolder('');
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
            <Label>Select Folder</Label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              value={folderName}
              onChange={(e) => {
                setFolderName(e.target.value);
                setNewFolder('');
              }}
            >
              <option value="">Select a folder...</option>
              {existingFolders.map((folder) => (
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
                setFolderName('');
              }}
              placeholder="Enter new folder name"
            />
          </div>

          <Button 
            className="w-full" 
            onClick={handleSave}
            disabled={!workflowName || (!folderName && !newFolder)}
          >
            Save
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
