
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';

interface AddApplianceDialogProps {
  onSave: (applianceName: string, symptoms: string[]) => void;
}

export function AddApplianceDialog({ onSave }: AddApplianceDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [applianceName, setApplianceName] = useState('');

  const handleSave = () => {
    if (!applianceName) return;
    onSave(applianceName, []);
    setIsOpen(false);
    setApplianceName('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-[#14162F] hover:bg-[#14162F]/90">+ Add Appliance</Button>
      </DialogTrigger>
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
