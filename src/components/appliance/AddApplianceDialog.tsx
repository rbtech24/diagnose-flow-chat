
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';

interface AddApplianceDialogProps {
  open: boolean;
  onClose: () => void;
  onAddAppliance: (applianceName: string) => void;
}

export function AddApplianceDialog({ open, onClose, onAddAppliance }: AddApplianceDialogProps) {
  const [applianceName, setApplianceName] = useState('');

  const handleSave = () => {
    if (!applianceName) return;
    onAddAppliance(applianceName);
    onClose();
    setApplianceName('');
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      if (!isOpen) onClose();
    }}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Appliance</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="applianceName">Appliance Name</Label>
            <Input
              id="applianceName"
              value={applianceName}
              onChange={(e) => setApplianceName(e.target.value)}
              placeholder="Enter appliance name"
            />
          </div>

          <Button 
            className="w-full" 
            onClick={handleSave}
            disabled={!applianceName}
          >
            Save Appliance
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
