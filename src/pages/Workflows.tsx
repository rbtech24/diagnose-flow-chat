
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { ArrowLeft, Edit, Trash, Share } from 'lucide-react';
import { getFolders, getWorkflowsInFolder } from '@/utils/flowUtils';
import { AddApplianceDialog } from '@/components/appliance/AddApplianceDialog';

interface Appliance {
  name: string;
  symptoms: string[];
}

export default function Workflows() {
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [appliances, setAppliances] = useState<Appliance[]>([
    {
      name: 'Electric Dryers',
      symptoms: ['Not Drying Clothes', 'Dead or Not Spinning', 'No Heat', 'Loud Noises']
    },
    {
      name: 'Gas Dryers',
      symptoms: ['Not Drying Clothes', 'Dead or Not Spinning', 'No Heat', 'Loud Noises']
    },
    {
      name: 'Top Load Washer',
      symptoms: [
        'Not Draining',
        'Not Filling',
        'Not Spinning',
        'Not Agitating',
        'Does Not Finish Cycle',
        'Leaking'
      ]
    }
  ]);

  const handleAddAppliance = (name: string, symptoms: string[]) => {
    setAppliances([...appliances, { name, symptoms }]);
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Link to="/">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Appliances</h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Re-arrange:</span>
            <Switch />
            <span className="text-sm font-medium">OFF</span>
          </div>
          <AddApplianceDialog onSave={handleAddAppliance} />
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {appliances.map((appliance) => (
          <Card key={appliance.name} className="p-4 shadow-sm border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-[#14162F]">{appliance.name}</h2>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" className="text-blue-500 hover:text-blue-600">
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600">
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="space-y-2">
              {appliance.symptoms.map((symptom) => (
                <div 
                  key={symptom}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-md"
                >
                  <span className="text-gray-700">{symptom}</span>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" className="text-blue-500 hover:text-blue-600 h-8 w-8 p-0">
                      <Share className="h-4 w-4" />
                    </Button>
                    <Switch />
                  </div>
                </div>
              ))}
            </div>
            
            <Button 
              variant="ghost" 
              className="mt-4 text-[#14162F] hover:bg-gray-100 w-full"
            >
              Add Issue
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
}
