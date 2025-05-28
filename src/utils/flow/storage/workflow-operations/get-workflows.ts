
import { SavedWorkflow } from '../../types';
import { WorkflowPersistence } from '../persistence';
import { toast } from '@/hooks/use-toast';

export const getAllWorkflows = async (): Promise<SavedWorkflow[]> => {
  try {
    const workflows = await WorkflowPersistence.loadWorkflows();
    console.log(`Loaded ${workflows.length} workflows`);
    return workflows;
  } catch (error) {
    console.error('Error getting all workflows:', error);
    toast({
      title: "Load Error",
      description: "Failed to load workflows",
      variant: "destructive"
    });
    return [];
  }
};
