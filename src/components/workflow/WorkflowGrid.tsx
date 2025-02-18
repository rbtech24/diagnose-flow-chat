
import { ApplianceCard } from '@/components/appliance/ApplianceCard';
import { Appliance } from '@/types/appliance';

interface WorkflowGridProps {
  appliances: Appliance[];
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
  if (appliances.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No appliances found matching your search criteria.</p>
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {appliances.map((appliance, index) => (
        <ApplianceCard
          key={appliance.name}
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
    </div>
  );
}
