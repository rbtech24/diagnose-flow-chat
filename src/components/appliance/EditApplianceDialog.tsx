
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { toast } from '@/hooks/use-toast';

interface EditApplianceDialogProps {
  applianceName: string;
  isOpen: boolean;
  onClose: () => void;
  onSave: (newName: string) => void;
}

export function EditApplianceDialog({ applianceName, isOpen, onClose, onSave }: EditApplianceDialogProps) {
  const [name, setName] = useState(applianceName);

  const handleSave = () => {
    if (!name.trim()) return;
    onSave(name.trim());
    onClose();
    toast({
      title: "Appliance Updated",
      description: `Appliance name has been updated successfully.`
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Appliance Name</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="applianceName">Appliance Name</Label>
            <Input
              id="applianceName"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter appliance name"
            />
          </div>
          <Button 
            className="w-full" 
            onClick={handleSave}
            disabled={!name.trim()}
          >
            Save Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
