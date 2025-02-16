
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { ArrowLeft, Edit, Trash, Share, GripVertical } from 'lucide-react';
import { getFolders, getWorkflowsInFolder } from '@/utils/flowUtils';
import { AddApplianceDialog } from '@/components/appliance/AddApplianceDialog';
import { toast } from '@/hooks/use-toast';

interface Appliance {
  name: string;
  symptoms: Array<{
    name: string;
    isActive: boolean;
    order: number;
  }>;
  order: number;
}

export default function Workflows() {
  const navigate = useNavigate();
  const [isReordering, setIsReordering] = useState(false);
  const [appliances, setAppliances] = useState<Appliance[]>([
    {
      name: 'Electric Dryers',
      order: 0,
      symptoms: [
        { name: 'Not Drying Clothes', isActive: true, order: 0 },
        { name: 'Dead or Not Spinning', isActive: true, order: 1 },
        { name: 'No Heat', isActive: false, order: 2 },
        { name: 'Loud Noises', isActive: true, order: 3 }
      ]
    },
    {
      name: 'Gas Dryers',
      order: 1,
      symptoms: [
        { name: 'Not Drying Clothes', isActive: true, order: 0 },
        { name: 'Dead or Not Spinning', isActive: false, order: 1 },
        { name: 'No Heat', isActive: true, order: 2 },
        { name: 'Loud Noises', isActive: true, order: 3 }
      ]
    },
    {
      name: 'Top Load Washer',
      order: 2,
      symptoms: [
        { name: 'Not Draining', isActive: true, order: 0 },
        { name: 'Not Filling', isActive: true, order: 1 },
        { name: 'Not Spinning', isActive: false, order: 2 },
        { name: 'Not Agitating', isActive: true, order: 3 },
        { name: 'Does Not Finish Cycle', isActive: true, order: 4 },
        { name: 'Leaking', isActive: true, order: 5 }
      ]
    }
  ]);

  const handleAddAppliance = (name: string, symptoms: string[]) => {
    const newAppliance: Appliance = {
      name,
      order: appliances.length,
      symptoms: symptoms.map((name, index) => ({
        name,
        isActive: true,
        order: index
      }))
    };
    setAppliances([...appliances, newAppliance]);
    toast({
      title: "Appliance Added",
      description: `${name} has been added successfully.`
    });
  };

  const handleToggleWorkflow = (applianceIndex: number, symptomIndex: number) => {
    const newAppliances = [...appliances];
    const symptom = newAppliances[applianceIndex].symptoms[symptomIndex];
    symptom.isActive = !symptom.isActive;
    setAppliances(newAppliances);
    
    toast({
      title: symptom.isActive ? "Workflow Activated" : "Workflow Deactivated",
      description: `${symptom.name} has been ${symptom.isActive ? 'activated' : 'deactivated'}.`
    });
  };

  const moveSymptom = (applianceIndex: number, fromIndex: number, toIndex: number) => {
    if (!isReordering) return;

    const newAppliances = [...appliances];
    const appliance = newAppliances[applianceIndex];
    const symptoms = [...appliance.symptoms];
    const [movedSymptom] = symptoms.splice(fromIndex, 1);
    symptoms.splice(toIndex, 0, movedSymptom);
    
    // Update order values
    symptoms.forEach((symptom, index) => {
      symptom.order = index;
    });
    
    appliance.symptoms = symptoms;
    setAppliances(newAppliances);
  };

  const moveAppliance = (fromIndex: number, toIndex: number) => {
    if (!isReordering) return;

    const newAppliances = [...appliances];
    const [movedAppliance] = newAppliances.splice(fromIndex, 1);
    newAppliances.splice(toIndex, 0, movedAppliance);
    
    // Update order values
    newAppliances.forEach((appliance, index) => {
      appliance.order = index;
    });
    
    setAppliances(newAppliances);
  };

  const openWorkflowEditor = (applianceName: string, symptomName: string) => {
    // Here you would navigate to the workflow editor with the appropriate parameters
    navigate(`/?appliance=${encodeURIComponent(applianceName)}&symptom=${encodeURIComponent(symptomName)}`);
  };

  const sortedAppliances = [...appliances].sort((a, b) => a.order - b.order);

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
            <Switch checked={isReordering} onCheckedChange={setIsReordering} />
            <span className="text-sm font-medium">{isReordering ? 'ON' : 'OFF'}</span>
          </div>
          <AddApplianceDialog onSave={handleAddAppliance} />
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedAppliances.map((appliance, applianceIndex) => (
          <Card 
            key={appliance.name} 
            className={`p-4 shadow-sm border-gray-100 ${isReordering ? 'cursor-move' : ''}`}
            draggable={isReordering}
            onDragStart={(e) => {
              e.dataTransfer.setData('appliance-index', applianceIndex.toString());
            }}
            onDragOver={(e) => {
              e.preventDefault();
            }}
            onDrop={(e) => {
              e.preventDefault();
              const fromIndex = parseInt(e.dataTransfer.getData('appliance-index'));
              if (fromIndex !== applianceIndex) {
                moveAppliance(fromIndex, applianceIndex);
              }
            }}
          >
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
              {[...appliance.symptoms]
                .sort((a, b) => a.order - b.order)
                .map((symptom, symptomIndex) => (
                <div 
                  key={symptom.name}
                  className={`flex items-center justify-between p-3 bg-gray-50 rounded-md ${
                    isReordering ? 'cursor-move' : ''
                  }`}
                  draggable={isReordering}
                  onDragStart={(e) => {
                    e.dataTransfer.setData('symptom-index', symptomIndex.toString());
                    e.dataTransfer.setData('appliance-index', applianceIndex.toString());
                  }}
                  onDragOver={(e) => {
                    e.preventDefault();
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    const fromSymptomIndex = parseInt(e.dataTransfer.getData('symptom-index'));
                    const fromApplianceIndex = parseInt(e.dataTransfer.getData('appliance-index'));
                    if (fromApplianceIndex === applianceIndex && fromSymptomIndex !== symptomIndex) {
                      moveSymptom(applianceIndex, fromSymptomIndex, symptomIndex);
                    }
                  }}
                >
                  <div className="flex items-center gap-2">
                    {isReordering && (
                      <GripVertical className="h-4 w-4 text-gray-400" />
                    )}
                    <span className="text-gray-700">{symptom.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-blue-500 hover:text-blue-600 h-8 w-8 p-0"
                      onClick={() => openWorkflowEditor(appliance.name, symptom.name)}
                    >
                      <Share className="h-4 w-4" />
                    </Button>
                    <Switch 
                      checked={symptom.isActive}
                      onCheckedChange={() => handleToggleWorkflow(applianceIndex, symptomIndex)}
                    />
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
