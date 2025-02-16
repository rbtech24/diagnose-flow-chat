
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Plus } from 'lucide-react';

interface AddApplianceDialogProps {
  onSave: (applianceName: string, symptoms: string[]) => void;
}

export function AddApplianceDialog({ onSave }: AddApplianceDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [applianceName, setApplianceName] = useState('');
  const [symptoms, setSymptoms] = useState(['']);

  const handleAddSymptom = () => {
    setSymptoms([...symptoms, '']);
  };

  const handleSymptomChange = (index: number, value: string) => {
    const newSymptoms = [...symptoms];
    newSymptoms[index] = value;
    setSymptoms(newSymptoms);
  };

  const handleSave = () => {
    if (!applianceName || symptoms.some(s => !s)) return;
    onSave(applianceName, symptoms.filter(s => s));
    setIsOpen(false);
    setApplianceName('');
    setSymptoms(['']);
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

          <div className="space-y-2">
            <Label>Symptoms</Label>
            {symptoms.map((symptom, index) => (
              <Input
                key={index}
                value={symptom}
                onChange={(e) => handleSymptomChange(index, e.target.value)}
                placeholder="Enter symptom"
                className="mb-2"
              />
            ))}
            <Button
              type="button"
              variant="outline"
              onClick={handleAddSymptom}
              className="w-full"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Symptom
            </Button>
          </div>

          <Button 
            className="w-full" 
            onClick={handleSave}
            disabled={!applianceName || symptoms.some(s => !s)}
          >
            Save Appliance
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
