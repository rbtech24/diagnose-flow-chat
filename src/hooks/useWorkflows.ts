
import { useState } from 'react';
import { toast } from '@/hooks/use-toast';
import { SavedWorkflow } from '@/utils/flow/types';
import { getAllWorkflows, moveWorkflowToFolder } from '@/utils/flow';

export function useWorkflows() {
  const [workflowsState, setWorkflowsState] = useState(getAllWorkflows());
  const [selectedFolder, setSelectedFolder] = useState<string>('');

  // Get all workflows to build the folders list
  const folders = [...new Set(workflowsState.map(w => w.metadata?.folder || 'Default'))];
  
  // Get workflows for the selected folder or all workflows if no folder is selected
  const workflows = selectedFolder 
    ? workflowsState.filter(w => w.metadata?.folder === selectedFolder)
    : workflowsState;

  const handleDeleteWorkflow = (workflow: SavedWorkflow) => {
    const updatedWorkflows = workflowsState.filter(w => 
      !(w.metadata.name === workflow.metadata.name && 
        w.metadata.folder === workflow.metadata.folder)
    );
    setWorkflowsState(updatedWorkflows);
    localStorage.setItem('diagnostic-workflows', JSON.stringify(updatedWorkflows));
    toast({
      title: "Workflow Deleted",
      description: `${workflow.metadata.name} has been deleted.`
    });
  };

  const handleToggleWorkflowActive = (workflow: SavedWorkflow) => {
    const updatedWorkflows = workflowsState.map(w => {
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
    setWorkflowsState(updatedWorkflows);
    localStorage.setItem('diagnostic-workflows', JSON.stringify(updatedWorkflows));
    toast({
      title: workflow.metadata.isActive ? "Workflow Deactivated" : "Workflow Activated",
      description: `${workflow.metadata.name} has been ${workflow.metadata.isActive ? 'deactivated' : 'activated'}.`
    });
  };

  const handleMoveWorkflow = (fromIndex: number, toIndex: number) => {
    const updatedWorkflows = [...workflows];
    const [movedWorkflow] = updatedWorkflows.splice(fromIndex, 1);
    updatedWorkflows.splice(toIndex, 0, movedWorkflow);
    
    if (selectedFolder) {
      const newState = workflowsState.filter(w => w.metadata?.folder !== selectedFolder);
      setWorkflowsState([...newState, ...updatedWorkflows]);
      localStorage.setItem('diagnostic-workflows', JSON.stringify([...newState, ...updatedWorkflows]));
    } else {
      setWorkflowsState(updatedWorkflows);
      localStorage.setItem('diagnostic-workflows', JSON.stringify(updatedWorkflows));
    }

    toast({
      title: "Workflow Moved",
      description: `${movedWorkflow.metadata.name} has been reordered successfully.`
    });
  };

  const handleMoveWorkflowToFolder = (workflow: SavedWorkflow, targetFolder: string) => {
    if (moveWorkflowToFolder(workflow, targetFolder)) {
      setWorkflowsState(getAllWorkflows());
      toast({
        title: "Workflow Moved",
        description: `${workflow.metadata.name} has been moved to ${targetFolder}.`
      });
    } else {
      toast({
        title: "Error",
        description: "Failed to move workflow to the selected folder.",
        variant: "destructive"
      });
    }
  };

  return {
    workflowsState,
    workflows,
    folders,
    selectedFolder,
    setSelectedFolder,
    handleDeleteWorkflow,
    handleToggleWorkflowActive,
    handleMoveWorkflow,
    handleMoveWorkflowToFolder
  };
}
