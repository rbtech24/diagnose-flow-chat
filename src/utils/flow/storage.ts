
import { toast } from '@/hooks/use-toast';
import { SavedWorkflow } from './types';

const STORAGE_KEY = 'diagnostic-workflows';

export const cleanupWorkflows = () => {
  try {
    const storedWorkflows = localStorage.getItem(STORAGE_KEY) || '[]';
    const workflows = JSON.parse(storedWorkflows);
    
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
    return [];
  }
};

export const getFolders = (): string[] => {
  try {
    const workflows = cleanupWorkflows();
    const folderSet = new Set<string>();
    
    workflows.forEach(workflow => {
      if (workflow.metadata?.folder) {
        folderSet.add(workflow.metadata.folder);
      }
    });
    
    // Add 'Default' folder if it doesn't exist
    folderSet.add('Default');
    
    return Array.from(folderSet).sort();
  } catch (error) {
    console.error('Error getting folders:', error);
    return ['Default'];
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
    return workflows.filter(w => w.metadata?.folder === folder);
  } catch (error) {
    console.error('Error getting workflows in folder:', error);
    return [];
  }
};

export const saveWorkflowToStorage = (workflow: SavedWorkflow): boolean => {
  try {
    // Initialize metadata if it doesn't exist
    if (!workflow.metadata) {
      workflow.metadata = {
        name: 'Untitled Workflow',
        folder: 'Default',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
    }

    // Ensure folder is set
    workflow.metadata.folder = workflow.metadata.folder || 'Default';

    const workflows = getAllWorkflows();
    
    // Find existing workflow by name AND folder
    const existingIndex = workflows.findIndex(w => 
      w.metadata?.name === workflow.metadata?.name && 
      w.metadata?.folder === workflow.metadata?.folder
    );

    // Update timestamps
    workflow.metadata.updatedAt = new Date().toISOString();
    if (existingIndex === -1) {
      workflow.metadata.createdAt = new Date().toISOString();
    }

    console.log('Saving workflow:', {
      name: workflow.metadata.name,
      folder: workflow.metadata.folder,
      nodes: workflow.nodes.length
    });

    if (existingIndex >= 0) {
      // Preserve creation date when updating
      const createdAt = workflows[existingIndex].metadata.createdAt;
      workflows[existingIndex] = {
        ...workflow,
        metadata: {
          ...workflow.metadata,
          createdAt
        }
      };
    } else {
      workflows.push(workflow);
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(workflows));
    
    console.log('Successfully saved workflow to storage');
    return true;
  } catch (error) {
    console.error('Error saving workflow to storage:', error);
    return false;
  }
};
