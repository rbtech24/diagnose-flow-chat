
import { useState } from 'react';
import { toast } from '@/hooks/use-toast';
import { SavedWorkflow } from '@/utils/flow/types';
import { supabase } from '@/integrations/supabase/client';
import { moveWorkflowToFolder } from '@/utils/flow';

export function useWorkflowActions(
  workflowsState: SavedWorkflow[],
  setWorkflowsState: React.Dispatch<React.SetStateAction<SavedWorkflow[]>>,
  loadWorkflows: () => Promise<void>
) {
  const handleDeleteWorkflow = async (workflow: SavedWorkflow) => {
    try {
      // First try to find the workflow in Supabase by name
      const { data, error: findError } = await supabase
        .from('workflows')
        .select('id')
        .eq('name', workflow.metadata.name)
        .maybeSingle();
        
      if (!findError && data) {
        // If found in Supabase, update is_active
        const { error } = await supabase
          .from('workflows')
          .update({ is_active: false })
          .eq('id', data.id);
          
        if (error) throw error;
      }
      
      // Also update localStorage
      setWorkflowsState(prev => prev.filter(w => 
        !(w.metadata.name === workflow.metadata.name && 
          w.metadata.folder === workflow.metadata.folder)
      ));
      
      const storedWorkflows = JSON.parse(localStorage.getItem('diagnostic-workflows') || '[]');
      const updatedWorkflows = storedWorkflows.filter((w: SavedWorkflow) => 
        !(w.metadata.name === workflow.metadata.name && 
          (w.metadata.folder === workflow.metadata.folder || 
           w.metadata.appliance === workflow.metadata.folder))
      );
      
      localStorage.setItem('diagnostic-workflows', JSON.stringify(updatedWorkflows));
      
      toast({
        title: "Workflow Deleted",
        description: `${workflow.metadata.name} has been deleted.`
      });
    } catch (error) {
      console.error('Error deleting workflow:', error);
      toast({
        title: "Error",
        description: "Failed to delete workflow",
        variant: "destructive"
      });
    }
  };

  const handleToggleWorkflowActive = async (workflow: SavedWorkflow) => {
    try {
      // First find the workflow in Supabase
      const { data, error: findError } = await supabase
        .from('workflows')
        .select('id')
        .eq('name', workflow.metadata.name)
        .maybeSingle();
        
      if (!findError && data) {
        // If found in Supabase, update is_active
        const { error } = await supabase
          .from('workflows')
          .update({ 
            is_active: !workflow.metadata.isActive 
          })
          .eq('id', data.id);
          
        if (error) throw error;
      }
      
      // Update state
      setWorkflowsState(prev => prev.map(w => {
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
      }));
      
      // Update localStorage
      const storedWorkflows = JSON.parse(localStorage.getItem('diagnostic-workflows') || '[]');
      const updatedWorkflows = storedWorkflows.map((w: SavedWorkflow) => {
        if (w.metadata.name === workflow.metadata.name && 
            (w.metadata.folder === workflow.metadata.folder || 
             w.metadata.appliance === workflow.metadata.folder)) {
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
      
      toast({
        title: workflow.metadata.isActive ? "Workflow Deactivated" : "Workflow Activated",
        description: `${workflow.metadata.name} has been ${workflow.metadata.isActive ? 'deactivated' : 'activated'}.`
      });
    } catch (error) {
      console.error('Error toggling workflow:', error);
      toast({
        title: "Error",
        description: "Failed to update workflow status",
        variant: "destructive"
      });
    }
  };

  const handleMoveWorkflow = async (fromIndex: number, toIndex: number) => {
    const updatedWorkflows = [...workflowsState];
    const [movedWorkflow] = updatedWorkflows.splice(fromIndex, 1);
    updatedWorkflows.splice(toIndex, 0, movedWorkflow);
    
    setWorkflowsState(updatedWorkflows);

    toast({
      title: "Workflow Moved",
      description: `${movedWorkflow.metadata.name} has been reordered successfully.`
    });
  };

  const handleMoveWorkflowToFolder = async (workflow: SavedWorkflow, targetFolder: string) => {
    const success = await moveWorkflowToFolder(workflow, targetFolder);
    if (success) {
      await loadWorkflows(); // Reload workflows to get updated data
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
    return success;
  };

  return {
    handleDeleteWorkflow,
    handleToggleWorkflowActive,
    handleMoveWorkflow,
    handleMoveWorkflowToFolder
  };
}
