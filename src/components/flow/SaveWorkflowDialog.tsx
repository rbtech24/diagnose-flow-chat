import { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Save } from 'lucide-react';
import { useAppliances } from '@/hooks/useAppliances';
import { getFolders } from '@/utils/flow';
import { useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';

interface SaveWorkflowDialogProps {
  onSave: (name: string, folder: string, appliance: string) => Promise<void>;
}

export function SaveWorkflowDialog({ onSave }: SaveWorkflowDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [workflowName, setWorkflowName] = useState('');
  const [selectedAppliance, setSelectedAppliance] = useState('');
  const [newAppliance, setNewAppliance] = useState('');
  const [appliances, setAppliances] = useState<string[]>([]);
  const { appliances: appliancesList } = useAppliances();
  const location = useLocation();
  
  const isWorkflowsPage = location.pathname === '/workflows';
  
  useEffect(() => {
    if (isOpen) {
      const loadFolders = async () => {
        try {
          const existingFolders = await getFolders();
          const availableAppliances = isWorkflowsPage 
            ? existingFolders 
            : [...new Set([...appliancesList.map(a => a.name), ...existingFolders])];
          setAppliances(availableAppliances);
          if (availableAppliances.length > 0) {
            setSelectedAppliance(availableAppliances[0]);
          }
        } catch (error) {
          console.error('Error loading folders:', error);
          toast.error("Failed to load folders");
        }
      };
      loadFolders();
    }
  }, [isOpen, isWorkflowsPage, appliancesList]);

  const handleSave = async () => {
    if (!workflowName) {
      toast.error("Please provide a workflow name");
      return;
    }

    const targetAppliance = newAppliance || selectedAppliance;
    if (!targetAppliance) {
      toast.error("Please select or create an appliance category");
      return;
    }

    try {
      await onSave(workflowName, targetAppliance, targetAppliance);
      setIsOpen(false);
      setWorkflowName('');
      setNewAppliance('');
      setSelectedAppliance(appliances[0] || '');
    } catch (error) {
      console.error('Error saving workflow:', error);
      toast.error("Failed to save the workflow. Please try again.");
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
            Save your workflow to an appliance category.
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
            <Label>Select Appliance</Label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              value={selectedAppliance}
              onChange={(e) => {
                setSelectedAppliance(e.target.value);
                setNewAppliance('');
              }}
            >
              {appliances.map((appliance) => (
                <option key={appliance} value={appliance}>
                  {appliance}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="newAppliance">Or Create New Appliance Category</Label>
            <Input
              id="newAppliance"
              value={newAppliance}
              onChange={(e) => {
                setNewAppliance(e.target.value);
                setSelectedAppliance('');
              }}
              placeholder="Enter new appliance category"
            />
          </div>

          <Button 
            className="w-full" 
            onClick={handleSave}
            disabled={!workflowName || (!selectedAppliance && !newAppliance)}
          >
            Save
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
