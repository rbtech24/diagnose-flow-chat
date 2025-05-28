
import { SavedWorkflow } from '../../types';
import { WorkflowPersistence } from '../persistence';
import { toast } from '@/hooks/use-toast';

export const getAllWorkflows = async (): Promise<SavedWorkflow[]> => {
  try {
    console.log('Attempting to load workflows from storage...');
    const workflows = await WorkflowPersistence.loadWorkflows();
    console.log(`Successfully loaded ${workflows.length} workflows from storage`);
    
    // Validate workflow structure
    const validWorkflows = workflows.filter((workflow) => {
      if (!workflow.metadata?.name || !workflow.metadata?.folder) {
        console.warn('Invalid workflow detected and filtered out:', workflow);
        return false;
      }
      return true;
    });

    if (validWorkflows.length !== workflows.length) {
      console.warn(`Filtered out ${workflows.length - validWorkflows.length} invalid workflows`);
    }

    return validWorkflows;
  } catch (error) {
    console.error('Error getting all workflows:', error);
    toast({
      title: "Load Error",
      description: "Failed to load workflows from storage",
      variant: "destructive"
    });
    return [];
  }
};
