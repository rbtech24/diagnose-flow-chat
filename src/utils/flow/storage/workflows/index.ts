
import { toast } from '@/hooks/use-toast';
import { SavedWorkflow } from '../../types';
import { fetchAllWorkflows, fetchWorkflowsByFolder, updateWorkflowCategory, upsertWorkflow } from './queries';
import { mapWorkflowFromDB } from './mapper';
import { getOrCreateCategory } from '../categories';

export const getAllWorkflows = async (): Promise<SavedWorkflow[]> => {
  try {
    const workflows = await fetchAllWorkflows();
    return workflows.map(mapWorkflowFromDB);
  } catch (error) {
    console.error('Error getting all workflows:', error);
    return [];
  }
};

export const getWorkflowsInFolder = async (folder: string): Promise<SavedWorkflow[]> => {
  try {
    const { data: category } = await getOrCreateCategory(folder);
    if (!category) return [];
    
    const workflows = await fetchWorkflowsByFolder(category.id);
    return workflows.map(mapWorkflowFromDB);
  } catch (error) {
    console.error('Error getting workflows in folder:', error);
    return [];
  }
};

export const moveWorkflowToFolder = async (
  workflow: SavedWorkflow,
  targetAppliance: string
): Promise<boolean> => {
  try {
    const { data: category } = await getOrCreateCategory(targetAppliance);
    if (!category) return false;
    
    await updateWorkflowCategory(workflow.metadata.name, category.id);
    return true;
  } catch (error) {
    console.error('Error moving workflow to folder:', error);
    return false;
  }
};

export const saveWorkflowToStorage = async (workflow: SavedWorkflow): Promise<boolean> => {
  try {
    if (!workflow.metadata?.appliance) {
      console.error('No appliance specified for workflow');
      return false;
    }

    const { data: category } = await getOrCreateCategory(workflow.metadata.appliance);
    if (!category) return false;

    await upsertWorkflow({
      name: workflow.metadata.name,
      category_id: category.id,
      description: '',
      flow_data: {
        nodes: workflow.nodes,
        edges: workflow.edges,
        nodeCounter: workflow.nodeCounter
      },
      is_active: workflow.metadata.isActive ?? true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    });
    
    toast({
      title: "Success",
      description: "Workflow saved successfully"
    });
    
    return true;
  } catch (error) {
    console.error('Error saving workflow to storage:', error);
    toast({
      title: "Error",
      description: "Failed to save workflow",
      variant: "destructive"
    });
    return false;
  }
};
