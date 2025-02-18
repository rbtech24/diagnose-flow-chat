
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Edit, Trash, ArrowUpRight, GripVertical, Plus, FileText } from 'lucide-react';
import { Appliance } from '@/types/appliance';
import { SavedWorkflow } from '@/utils/flow/types';
import { useNavigate } from 'react-router-dom';

interface ApplianceCardProps {
  appliance: Appliance;
  index: number;
  isReordering: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onToggleWorkflow: (symptomIndex: number) => void;
  onMoveSymptom: (fromIndex: number, toIndex: number) => void;
  onMoveAppliance: (fromIndex: number, toIndex: number) => void;
  onOpenWorkflowEditor: (applianceName: string, symptomName?: string) => void;
  onAddIssue: (applianceName: string) => void;
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
  onAddIssue,
  getSymptomCardColor
}: ApplianceCardProps) {
  const navigate = useNavigate();
  const applianceWorkflows = JSON.parse(localStorage.getItem('diagnostic-workflows') || '[]')
    .filter((w: SavedWorkflow) => w.metadata.folder === appliance.name);

  const handleOpenWorkflowEditor = (applianceName: string, workflowName?: string) => {
    const path = `/workflow-editor?folder=${encodeURIComponent(applianceName)}${workflowName ? `&name=${encodeURIComponent(workflowName)}` : ''}`;
    navigate(path);
  };

  const handleMoveWorkflow = (fromIndex: number, toIndex: number) => {
    const workflows = [...applianceWorkflows];
    const [movedWorkflow] = workflows.splice(fromIndex, 1);
    workflows.splice(toIndex, 0, movedWorkflow);
    
    const allWorkflows = JSON.parse(localStorage.getItem('diagnostic-workflows') || '[]');
    const updatedWorkflows = allWorkflows.map((w: SavedWorkflow) => {
      if (w.metadata.folder === appliance.name) {
        const matchingWorkflow = workflows.find((moved: SavedWorkflow) => 
          moved.metadata.name === w.metadata.name
        );
        return matchingWorkflow || w;
      }
      return w;
    });
    
    localStorage.setItem('diagnostic-workflows', JSON.stringify(updatedWorkflows));
    window.location.reload();
  };

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
      
      {applianceWorkflows.length > 0 && (
        <div className="mb-4 space-y-2">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Workflows</h3>
          {applianceWorkflows.map((workflow: SavedWorkflow, workflowIndex: number) => (
            <div
              key={workflow.metadata.name}
              className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
              draggable={isReordering}
              onDragStart={(e) => {
                e.dataTransfer.setData('workflow-index', workflowIndex.toString());
              }}
              onDragOver={(e) => {
                e.preventDefault();
              }}
              onDrop={(e) => {
                e.preventDefault();
                const fromIndex = parseInt(e.dataTransfer.getData('workflow-index'));
                if (fromIndex !== workflowIndex) {
                  handleMoveWorkflow(fromIndex, workflowIndex);
                }
              }}
            >
              <div className="flex items-center gap-2">
                {isReordering && (
                  <GripVertical className="h-4 w-4 text-gray-400 cursor-grab" />
                )}
                <FileText className="h-4 w-4 text-green-500" />
                <span className="text-base font-semibold text-gray-700">{workflow.metadata.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-50"
                  onClick={(e) => {
                    e.stopPropagation();
                    const updatedWorkflows = JSON.parse(localStorage.getItem('diagnostic-workflows') || '[]')
                      .filter((w: SavedWorkflow) => 
                        !(w.metadata.name === workflow.metadata.name && 
                          w.metadata.folder === workflow.metadata.folder)
                      );
                    localStorage.setItem('diagnostic-workflows', JSON.stringify(updatedWorkflows));
                    window.location.reload();
                  }}
                >
                  <Trash className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={() => handleOpenWorkflowEditor(appliance.name, workflow.metadata.name)}
                >
                  <ArrowUpRight className="h-4 w-4" />
                </Button>
                <Switch 
                  checked={workflow.metadata.isActive}
                  onCheckedChange={() => {
                    const updatedWorkflows = JSON.parse(localStorage.getItem('diagnostic-workflows') || '[]')
                      .map((w: SavedWorkflow) => {
                        if (w.metadata.name === workflow.metadata.name && 
                            w.metadata.folder === workflow.metadata.folder) {
                          return {
                            ...w,
                            metadata: {
                              ...w.metadata,
                              isActive: !w.metadata.isActive
                            }
                          };
                        }
                        return w;
                      });
                    localStorage.setItem('diagnostic-workflows', JSON.stringify(updatedWorkflows));
                    window.location.reload();
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
      
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
                onClick={() => onOpenWorkflowEditor(appliance.name, symptom.name)}
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
        onClick={() => handleOpenWorkflowEditor(appliance.name)}
      >
        <Plus className="h-4 w-4" />
        Add Issue
      </Button>
    </Card>
  );
}
