
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Edit, Trash, ArrowUpRight, GripVertical, Plus } from 'lucide-react';
import { Appliance } from '@/types/appliance';

interface ApplianceCardProps {
  appliance: Appliance;
  index: number;
  isReordering: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onToggleWorkflow: (symptomIndex: number) => void;
  onMoveSymptom: (fromIndex: number, toIndex: number) => void;
  onMoveAppliance: (fromIndex: number, toIndex: number) => void;
  onOpenWorkflowEditor: (symptomName?: string) => void;
  getSymptomCardColor: (index: number) => string;
}

export function ApplianceCard({
  appliance,
  index,
  isReordering,
  onEdit,
  onDelete,
  onToggleWorkflow,
  onMoveSymptom,
  onMoveAppliance,
  onOpenWorkflowEditor,
  getSymptomCardColor
}: ApplianceCardProps) {
  return (
    <Card 
      className={`p-4 shadow-sm border-gray-100 hover:shadow-md transition-shadow ${isReordering ? 'cursor-move' : ''}`}
      draggable={isReordering}
      onDragStart={(e) => {
        e.dataTransfer.setData('appliance-index', index.toString());
      }}
      onDragOver={(e) => {
        e.preventDefault();
      }}
      onDrop={(e) => {
        e.preventDefault();
        const fromIndex = parseInt(e.dataTransfer.getData('appliance-index'));
        if (fromIndex !== index) {
          onMoveAppliance(fromIndex, index);
        }
      }}
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-[#14162F]">{appliance.name}</h2>
        <div className="flex gap-2">
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-blue-500 hover:text-blue-600 hover:bg-blue-50"
            onClick={onEdit}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-red-500 hover:text-red-600 hover:bg-red-50"
            onClick={onDelete}
          >
            <Trash className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className="space-y-2.5">
        {[...appliance.symptoms]
          .sort((a, b) => a.order - b.order)
          .map((symptom, symptomIndex) => (
          <div 
            key={symptom.name}
            className={`flex items-center justify-between p-3.5 rounded-lg ${
              getSymptomCardColor(symptomIndex)
            } transition-all duration-200 ${isReordering ? 'cursor-move' : ''}`}
            draggable={isReordering}
            onDragStart={(e) => {
              e.dataTransfer.setData('symptom-index', symptomIndex.toString());
              e.dataTransfer.setData('appliance-index', index.toString());
            }}
            onDragOver={(e) => {
              e.preventDefault();
            }}
            onDrop={(e) => {
              e.preventDefault();
              const fromSymptomIndex = parseInt(e.dataTransfer.getData('symptom-index'));
              const fromApplianceIndex = parseInt(e.dataTransfer.getData('appliance-index'));
              if (fromApplianceIndex === index && fromSymptomIndex !== symptomIndex) {
                onMoveSymptom(fromSymptomIndex, symptomIndex);
              }
            }}
          >
            <div className="flex items-center gap-2">
              {isReordering && (
                <GripVertical className="h-4 w-4 text-gray-400" />
              )}
              <span className="text-gray-700 font-medium">{symptom.name}</span>
            </div>
            <div className="flex items-center gap-3">
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-[#8B5CF6] hover:text-[#7C3AED] hover:bg-[#8B5CF6]/10 h-8 w-8 p-0 rounded-full"
                onClick={() => onOpenWorkflowEditor(symptom.name)}
              >
                <ArrowUpRight className="h-4 w-4" />
              </Button>
              <Switch 
                checked={symptom.isActive}
                onCheckedChange={() => onToggleWorkflow(symptomIndex)}
              />
            </div>
          </div>
        ))}
      </div>
      
      <Button 
        className="mt-4 w-full bg-gradient-to-r from-[#9b87f5] to-[#8B5CF6] hover:from-[#8B5CF6] hover:to-[#7C3AED] text-white gap-2 shadow-sm"
        onClick={() => onOpenWorkflowEditor()}
      >
        <Plus className="h-4 w-4" />
        Add Issue
      </Button>
    </Card>
  );
}
