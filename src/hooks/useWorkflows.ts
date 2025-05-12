
import { useWorkflowsList } from './workflows/useWorkflowsList';
import { useWorkflowActions } from './workflows/useWorkflowActions';

export function useWorkflows() {
  const {
    workflows,
    workflowsState,
    setWorkflowsState,
    selectedFolder,
    setSelectedFolder,
    isLoading,
    folders,
    loadWorkflows
  } = useWorkflowsList();

  const {
    handleDeleteWorkflow,
    handleToggleWorkflowActive,
    handleMoveWorkflow,
    handleMoveWorkflowToFolder
  } = useWorkflowActions(workflowsState, setWorkflowsState, loadWorkflows);

  // Add some console logging to help debug issues
  console.log("useWorkflows - folders:", folders);
  console.log("useWorkflows - workflows count:", workflows.length);
  console.log("useWorkflows - selected folder:", selectedFolder);

  return {
    workflowsState,
    workflows,
    folders,
    selectedFolder,
    isLoading,
    setSelectedFolder,
    handleDeleteWorkflow,
    handleToggleWorkflowActive,
    handleMoveWorkflow,
    handleMoveWorkflowToFolder,
    loadWorkflows
  };
}
