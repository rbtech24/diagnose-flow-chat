
import { WorkflowGrid } from './WorkflowGrid';
import { Appliance } from '@/types/appliance';
import { SavedWorkflow } from '@/utils/flow/types';

interface WorkflowViewProps {
  filteredAppliances: Appliance[];
  workflows: SavedWorkflow[];
  isReordering: boolean;
  selectedFolder: string;
  onEdit?: (index: number, name: string) => void;
  onDelete?: (index: number) => void;
  onToggleWorkflow?: (applianceIndex: number, symptomIndex: number) => void;
  onMoveSymptom?: (applianceIndex: number, fromIndex: number, toIndex: number) => void;
  onMoveAppliance?: (fromIndex: number, toIndex: number) => void;
  onOpenWorkflowEditor?: (applianceName: string, symptomName?: string) => void;
  onAddIssue?: (applianceName: string) => void;
  onDeleteWorkflow?: (workflow: SavedWorkflow) => void;
  onMoveWorkflow?: (fromIndex: number, toIndex: number) => void;
  onToggleWorkflowActive?: (workflow: SavedWorkflow) => void;
  onMoveWorkflowToFolder?: (workflow: SavedWorkflow, targetFolder: string) => Promise<boolean>;
  isReadOnly?: boolean;
  workflowsByFolder?: Record<string, SavedWorkflow[]>;
  enableFolderView?: boolean;
  enableDragDrop?: boolean; // New prop to control drag and drop functionality
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
  isReadOnly = false,
  workflowsByFolder = {},
  enableFolderView = false,
  enableDragDrop = false // Default to false
}: WorkflowViewProps) {
  // Generate pastel colors for item cards
  const getSymptomCardColor = (index: number) => {
    const colors = [
      'bg-blue-100 border-blue-200',
      'bg-green-100 border-green-200',
      'bg-purple-100 border-purple-200',
      'bg-amber-100 border-amber-200',
      'bg-rose-100 border-rose-200',
      'bg-teal-100 border-teal-200',
    ];
    return colors[index % colors.length];
  };

  return (
    <div className="mt-6">
      <WorkflowGrid
        appliances={filteredAppliances}
        workflows={workflows}
        isReordering={isReordering}
        onEdit={onEdit || (() => {})}
        onDelete={onDelete || (() => {})}
        onToggleWorkflow={onToggleWorkflow || (() => {})}
        onMoveSymptom={onMoveSymptom || (() => {})}
        onMoveAppliance={onMoveAppliance || (() => {})}
        onOpenWorkflowEditor={onOpenWorkflowEditor || (() => {})}
        onAddIssue={onAddIssue || (() => {})}
        onDeleteWorkflow={onDeleteWorkflow || (() => {})}
        onMoveWorkflow={onMoveWorkflow || (() => {})}
        onToggleWorkflowActive={onToggleWorkflowActive || (() => {})}
        onMoveWorkflowToFolder={onMoveWorkflowToFolder || (() => Promise.resolve(false))}
        getSymptomCardColor={getSymptomCardColor}
        isReadOnly={isReadOnly}
        workflowsByFolder={workflowsByFolder}
        enableFolderView={enableFolderView}
        enableDragDrop={enableDragDrop} // Pass the new prop to WorkflowGrid
      />
    </div>
  );
}
