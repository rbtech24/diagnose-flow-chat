
import { ApplianceCard } from '@/components/appliance/ApplianceCard';
import { Appliance } from '@/types/appliance';
import { SavedWorkflow } from '@/utils/flow/types';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowUpRight, Trash, GripVertical, MenuSquare } from 'lucide-react';
import { Switch } from '@/components/ui/switch';

interface WorkflowGridProps {
  appliances: Appliance[];
  workflows: SavedWorkflow[];
  isReordering: boolean;
  onEdit: (index: number, name: string) => void;
  onDelete: (index: number) => void;
  onToggleWorkflow: (applianceIndex: number, symptomIndex: number) => void;
  onMoveSymptom: (applianceIndex: number, fromIndex: number, toIndex: number) => void;
  onMoveAppliance: (fromIndex: number, toIndex: number) => void;
  onOpenWorkflowEditor: (applianceName: string, symptomName?: string) => void;
  onAddIssue: (applianceName: string) => void;
  onDeleteWorkflow: (workflow: SavedWorkflow) => void;
  onMoveWorkflow: (fromIndex: number, toIndex: number) => void;
  onToggleWorkflowActive: (workflow: SavedWorkflow) => void;
  getSymptomCardColor: (index: number) => string;
}

export function WorkflowGrid({
  appliances,
  workflows,
  isReordering,
  onEdit,
  onDelete,
  onToggleWorkflow,
  onMoveSymptom,
  onMoveAppliance,
  onOpenWorkflowEditor,
  onAddIssue,
  onDeleteWorkflow,
  onMoveWorkflow,
  onToggleWorkflowActive,
  getSymptomCardColor,
}: WorkflowGridProps) {
  if (appliances.length === 0 && workflows.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No appliances or workflows found matching your search criteria.</p>
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Display Appliances */}
      {appliances.map((appliance, index) => (
        <ApplianceCard
          key={`appliance-${appliance.name}`}
          appliance={appliance}
          index={index}
          isReordering={isReordering}
          onEdit={() => onEdit(index, appliance.name)}
          onDelete={() => onDelete(index)}
          onToggleWorkflow={(symptomIndex) => onToggleWorkflow(index, symptomIndex)}
          onMoveSymptom={(fromIndex, toIndex) => onMoveSymptom(index, fromIndex, toIndex)}
          onMoveAppliance={onMoveAppliance}
          onOpenWorkflowEditor={(symptomName) => onOpenWorkflowEditor(appliance.name, symptomName)}
          onAddIssue={() => onAddIssue(appliance.name)}
          getSymptomCardColor={getSymptomCardColor}
        />
      ))}

      {/* Display Workflows */}
      {workflows.map((workflow, index) => (
        <Card 
          key={`workflow-${workflow.metadata.name}-${workflow.metadata.folder}`}
          className="group relative p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 bg-gradient-to-br from-white to-gray-50"
          draggable={isReordering}
          onDragStart={(e) => {
            e.dataTransfer.setData('workflow-index', index.toString());
          }}
          onDragOver={(e) => {
            e.preventDefault();
          }}
          onDrop={(e) => {
            e.preventDefault();
            const fromIndex = parseInt(e.dataTransfer.getData('workflow-index'));
            if (fromIndex !== index) {
              onMoveWorkflow(fromIndex, index);
            }
          }}
        >
          {isReordering && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2">
              <GripVertical className="h-5 w-5 text-gray-400 cursor-move" />
            </div>
          )}
          
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <MenuSquare className="h-4 w-4 text-indigo-400" />
                <h2 className="text-lg font-semibold text-gray-900 truncate">
                  {workflow.metadata.name}
                </h2>
              </div>
              <p className="text-sm text-gray-500 mb-2">
                Folder: {workflow.metadata.folder}
              </p>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <div className="flex items-center gap-1.5">
                  <div className="h-2 w-2 rounded-full bg-indigo-400"></div>
                  {workflow.nodes.length} steps
                </div>
                <div className="h-4 w-px bg-gray-200"></div>
                <div className={`text-sm ${workflow.metadata.isActive ? 'text-green-600' : 'text-gray-500'}`}>
                  {workflow.metadata.isActive ? 'Active' : 'Inactive'}
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Switch
                checked={workflow.metadata.isActive}
                onCheckedChange={() => onToggleWorkflowActive(workflow)}
                className="mr-1 data-[state=checked]:bg-green-500"
              />
              <div className="flex gap-1">
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-50"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onDeleteWorkflow(workflow);
                  }}
                >
                  <Trash className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="h-8 w-8 p-0 text-indigo-500 hover:text-indigo-600 hover:bg-indigo-50"
                  onClick={() => onOpenWorkflowEditor(workflow.metadata.folder || '', workflow.metadata.name)}
                >
                  <ArrowUpRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
