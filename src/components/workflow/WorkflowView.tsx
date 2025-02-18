
import { WorkflowGrid } from '@/components/workflow/WorkflowGrid';
import { Appliance } from '@/types/appliance';
import { SavedWorkflow } from '@/utils/flow/types';

interface WorkflowViewProps {
  filteredAppliances: Appliance[];
  workflows: SavedWorkflow[];
  isReordering: boolean;
  selectedFolder: string;
  onEdit: (index: number, name: string) => void;
  onDelete: (index: number) => void;
  onToggleWorkflow: (applianceIndex: number, symptomIndex: number) => void;
  onMoveSymptom: (applianceIndex: number, fromIndex: number, toIndex: number) => void;
  onMoveAppliance: (fromIndex: number, toIndex: number) => void;
  onOpenWorkflowEditor: (folder: string, name?: string) => void;
  onAddIssue: (applianceName: string) => void;
  onDeleteWorkflow: (workflow: SavedWorkflow) => void;
  onMoveWorkflow: (fromIndex: number, toIndex: number) => void;
  onToggleWorkflowActive: (workflow: SavedWorkflow) => void;
  onMoveWorkflowToFolder: (workflow: SavedWorkflow, targetFolder: string) => void;
}

export function WorkflowView({
  filteredAppliances,
  workflows,
  isReordering,
  selectedFolder,
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
  onMoveWorkflowToFolder,
}: WorkflowViewProps) {
  const getSymptomCardColor = (index: number): string => {
    const colors = [
      'bg-blue-100',
      'bg-green-100',
      'bg-yellow-100',
      'bg-purple-100',
      'bg-pink-100',
      'bg-indigo-100'
    ];
    return colors[index % colors.length];
  };

  // Filter out workflows that belong to any appliance
  const orphanedWorkflows = workflows.filter(workflow => 
    !filteredAppliances.some(appliance => appliance.name === workflow.metadata.folder)
  );

  return (
    <WorkflowGrid
      appliances={filteredAppliances}
      workflows={orphanedWorkflows}
      isReordering={isReordering}
      onEdit={onEdit}
      onDelete={onDelete}
      onToggleWorkflow={onToggleWorkflow}
      onMoveSymptom={onMoveSymptom}
      onMoveAppliance={onMoveAppliance}
      onOpenWorkflowEditor={onOpenWorkflowEditor}
      onAddIssue={onAddIssue}
      onDeleteWorkflow={onDeleteWorkflow}
      onMoveWorkflow={onMoveWorkflow}
      onToggleWorkflowActive={onToggleWorkflowActive}
      onMoveWorkflowToFolder={onMoveWorkflowToFolder}
      getSymptomCardColor={getSymptomCardColor}
    />
  );
}
