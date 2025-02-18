
import { ApplianceCard } from '@/components/appliance/ApplianceCard';
import { Appliance } from '@/types/appliance';
import { SavedWorkflow } from '@/utils/flow/types';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowUpRight } from 'lucide-react';

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
          className="p-4 shadow-sm border-gray-100 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-semibold text-[#14162F]">{workflow.metadata.name}</h2>
              <p className="text-sm text-gray-500">Folder: {workflow.metadata.folder}</p>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-[#8B5CF6] hover:text-[#7C3AED] hover:bg-[#8B5CF6]/10"
              onClick={() => onOpenWorkflowEditor(workflow.metadata.folder || '', workflow.metadata.name)}
            >
              <ArrowUpRight className="h-4 w-4" />
            </Button>
          </div>
          <div className="text-sm text-gray-600">
            {workflow.nodes.length} steps
          </div>
        </Card>
      ))}
    </div>
  );
}
