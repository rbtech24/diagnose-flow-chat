
import { SavedWorkflow } from '../../types';
import { WorkflowPersistence } from '../persistence';
import { toast } from '@/hooks/use-toast';

export const saveWorkflowToStorage = async (workflow: SavedWorkflow): Promise<boolean> => {
  try {
    if (!workflow.metadata?.folder) {
      console.error('No folder specified for workflow');
      return false;
    }

    const success = await WorkflowPersistence.saveWorkflow(workflow);
    
    if (success) {
      console.log('Workflow saved successfully');
    } else {
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
      description: "Failed to save workflow",
      variant: "destructive"
    });
    return false;
  }
};
