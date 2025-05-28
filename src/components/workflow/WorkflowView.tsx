
import { WorkflowGrid } from './WorkflowGrid';
import { toast } from '@/hooks/use-toast';
import { WorkflowViewProps, SymptomCardColorFunction } from '@/types/workflow-props';
import { ApplicationError } from '@/types/error';

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
  enableDragDrop = false
}: WorkflowViewProps) {
  
  // Generate pastel colors for item cards
  const getSymptomCardColor: SymptomCardColorFunction = (index: number): string => {
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

  const handleOpenWorkflowEditor = (folder: string, name?: string): void => {
    console.log("WorkflowView calling onOpenWorkflowEditor with:", folder, name);
    
    try {
      if (onOpenWorkflowEditor && typeof onOpenWorkflowEditor === 'function') {
        onOpenWorkflowEditor(folder, name);
      } else {
        console.warn("onOpenWorkflowEditor prop is not provided or is not a function");
        const error: ApplicationError = {
          message: "Workflow editor cannot be opened at this time.",
          code: 'WORKFLOW_EDITOR_UNAVAILABLE',
          timestamp: new Date()
        };
        
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error opening workflow editor:", error);
      
      const applicationError: ApplicationError = {
        message: "Failed to open workflow editor.",
        code: 'WORKFLOW_EDITOR_ERROR',
        timestamp: new Date()
      };
      
      toast({
        title: "Error",
        description: applicationError.message,
        variant: "destructive"
      });
    }
  };

  // Validate props with proper type checking
  const validatedAppliances = Array.isArray(filteredAppliances) ? filteredAppliances : [];
  const validatedWorkflows = Array.isArray(workflows) ? workflows : [];

  if (!Array.isArray(filteredAppliances)) {
    console.warn("filteredAppliances prop is not an array, defaulting to empty array");
  }

  if (!Array.isArray(workflows)) {
    console.warn("workflows prop is not an array, defaulting to empty array");
  }

  return (
    <div className="mt-6">
      <WorkflowGrid
        appliances={validatedAppliances}
        workflows={validatedWorkflows}
        isReordering={isReordering}
        onEdit={onEdit || (() => {})}
        onDelete={onDelete || (() => {})}
        onToggleWorkflow={onToggleWorkflow || (() => {})}
        onMoveSymptom={onMoveSymptom || (() => {})}
        onMoveAppliance={onMoveAppliance || (() => {})}
        onOpenWorkflowEditor={handleOpenWorkflowEditor}
        onAddIssue={onAddIssue || (() => {})}
        onDeleteWorkflow={onDeleteWorkflow || (() => {})}
        onMoveWorkflow={onMoveWorkflow || (() => {})}
        onToggleWorkflowActive={onToggleWorkflowActive || (() => {})}
        onMoveWorkflowToFolder={onMoveWorkflowToFolder || (() => Promise.resolve(false))}
        getSymptomCardColor={getSymptomCardColor}
        isReadOnly={isReadOnly}
        workflowsByFolder={workflowsByFolder}
        enableFolderView={enableFolderView}
        enableDragDrop={enableDragDrop}
      />
    </div>
  );
}
