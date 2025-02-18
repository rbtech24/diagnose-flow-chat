
import { toast } from '@/hooks/use-toast';
import { SavedWorkflow } from './types';

const STORAGE_KEY = 'diagnostic-workflows';

export const cleanupWorkflows = () => {
  try {
    const storedWorkflows = localStorage.getItem(STORAGE_KEY) || '[]';
    const workflows = JSON.parse(storedWorkflows);
    
    // Only filter out invalid workflows, don't require folder initially
    const cleanedWorkflows = workflows.filter(workflow => 
      workflow && 
      workflow.nodes && 
      Array.isArray(workflow.nodes) && 
      workflow.nodes.length > 0
    );
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cleanedWorkflows));
    return cleanedWorkflows;
  } catch (error) {
    console.error('Error cleaning up workflows:', error);
    toast({
      title: "Error",
      description: "Failed to load workflows. Local storage might be corrupted.",
      variant: "destructive"
    });
    return [];
  }
};

export const getFolders = (): string[] => {
  try {
    const workflows = cleanupWorkflows();
    const folderSet = new Set<string>();
    
    workflows.forEach(workflow => {
      // Include workflows without folders in a "Default" folder
      const folder = workflow.metadata?.folder || 'Default';
      folderSet.add(folder);
    });
    
    return Array.from(folderSet).sort();
  } catch (error) {
    console.error('Error getting folders:', error);
    return [];
  }
};

export const getAllWorkflows = (): SavedWorkflow[] => {
  try {
    return cleanupWorkflows();
  } catch (error) {
    console.error('Error getting all workflows:', error);
    return [];
  }
};

export const getWorkflowsInFolder = (folder: string): SavedWorkflow[] => {
  try {
    const workflows = getAllWorkflows();
    // Match workflows with the specified folder, or those without a folder if folder is "Default"
    const folderWorkflows = workflows.filter(w => 
      folder === 'Default' 
        ? !w.metadata?.folder 
        : w.metadata?.folder === folder
    );
    console.log(`Found ${folderWorkflows.length} workflows in folder ${folder}`);
    return folderWorkflows;
  } catch (error) {
    console.error('Error getting workflows in folder:', error);
    return [];
  }
};

export const saveWorkflowToStorage = (workflow: SavedWorkflow): boolean => {
  try {
    // Ensure workflow has metadata
    if (!workflow.metadata) {
      workflow.metadata = {
        name: 'Untitled Workflow',
        folder: 'Default',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
    }

    const workflows = getAllWorkflows();
    console.log('Current workflows:', workflows);
    console.log('Saving workflow:', workflow);
    
    const existingIndex = workflows.findIndex(w => 
      w.metadata?.name === workflow.metadata?.name && 
      w.metadata?.folder === workflow.metadata?.folder
    );

    // Update metadata timestamps
    workflow.metadata.updatedAt = new Date().toISOString();
    if (existingIndex === -1) {
      workflow.metadata.createdAt = new Date().toISOString();
    }

    if (existingIndex >= 0) {
      workflows[existingIndex] = {
        ...workflow,
        metadata: {
          ...workflow.metadata,
          createdAt: workflows[existingIndex].metadata.createdAt // Preserve original creation date
        }
      };
      console.log('Updated existing workflow at index:', existingIndex);
    } else {
      workflows.push(workflow);
      console.log('Added new workflow, total workflows:', workflows.length);
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(workflows));
    return true;
  } catch (error) {
    console.error('Error saving workflow to storage:', error);
    toast({
      title: "Error",
      description: "Failed to save workflow. Please try again.",
      variant: "destructive"
    });
    return false;
  }
};
