
import { SavedWorkflow } from '../../types';
import { WorkflowPersistence } from '../persistence';
import { toast } from '@/hooks/use-toast';

export const saveWorkflowToStorage = async (workflow: SavedWorkflow): Promise<boolean> => {
  try {
    console.log('Attempting to save workflow:', workflow.metadata?.name);
    
    // Validate workflow structure before saving
    if (!workflow.metadata?.folder) {
      console.error('Workflow validation failed: No folder specified');
      toast({
        title: "Validation Error",
        description: "Workflow must have a folder specified",
        variant: "destructive"
      });
      return false;
    }

    if (!workflow.metadata?.name) {
      console.error('Workflow validation failed: No name specified');
      toast({
        title: "Validation Error", 
        description: "Workflow must have a name specified",
        variant: "destructive"
      });
      return false;
    }

    if (!workflow.nodes || !Array.isArray(workflow.nodes)) {
      console.error('Workflow validation failed: Invalid nodes structure');
      toast({
        title: "Validation Error",
        description: "Workflow must have valid nodes structure",
        variant: "destructive"
      });
      return false;
    }

    const success = await WorkflowPersistence.saveWorkflow(workflow);
    
    if (success) {
      console.log('Workflow saved successfully:', workflow.metadata.name);
      toast({
        title: "Success",
        description: `Workflow "${workflow.metadata.name}" saved successfully`,
        variant: "default"
      });
    } else {
      console.warn('Workflow saved with warnings');
      toast({
        title: "Save Warning",
        description: "Workflow saved locally but may not be synchronized",
        variant: "destructive"
      });
    }
    
    return success;
  } catch (error) {
    console.error('Error saving workflow to storage:', error);
    toast({
      title: "Save Error",
      description: `Failed to save workflow: ${error instanceof Error ? error.message : 'Unknown error'}`,
      variant: "destructive"
    });
    return false;
  }
};
