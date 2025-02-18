
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
      workflow.nodes.length > 0 &&
      workflow.metadata?.appliance // Ensure appliance exists
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
      if (workflow.metadata?.appliance) {
        folderSet.add(workflow.metadata.appliance);
      }
    });
    
    return Array.from(folderSet).sort();
  } catch (error) {
    console.error('Error getting folders:', error);
    return [];
  }
};

export const getAllWorkflows = (): SavedWorkflow[] => {
  try {
    const workflows = cleanupWorkflows();
    // Sort workflows by appliance and then by name
    return workflows.sort((a, b) => {
      const applianceCompare = (a.metadata.appliance || '').localeCompare(b.metadata.appliance || '');
      if (applianceCompare !== 0) return applianceCompare;
      return a.metadata.name.localeCompare(b.metadata.name);
    });
  } catch (error) {
    console.error('Error getting all workflows:', error);
    return [];
  }
};

export const getWorkflowsInFolder = (folder: string): SavedWorkflow[] => {
  try {
    const workflows = getAllWorkflows();
    return workflows.filter(w => w.metadata?.appliance === folder);
  } catch (error) {
    console.error('Error getting workflows in folder:', error);
    return [];
  }
};

export const moveWorkflowToFolder = (
  workflow: SavedWorkflow,
  targetAppliance: string
): boolean => {
  try {
    const workflows = getAllWorkflows();
    const workflowIndex = workflows.findIndex(
      w => w.metadata.name === workflow.metadata.name && 
           w.metadata.appliance === workflow.metadata.appliance
    );

    if (workflowIndex === -1) {
      console.error('Workflow not found');
      return false;
    }

    // Update the workflow's appliance and folder
    workflows[workflowIndex] = {
      ...workflow,
      metadata: {
        ...workflow.metadata,
        appliance: targetAppliance,
        folder: targetAppliance,
        updatedAt: new Date().toISOString()
      }
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(workflows));
    return true;
  } catch (error) {
    console.error('Error moving workflow to folder:', error);
    return false;
  }
};

export const saveWorkflowToStorage = (workflow: SavedWorkflow): boolean => {
  try {
    if (!workflow.metadata?.appliance) {
      console.error('No appliance specified for workflow');
      return false;
    }

    const workflows = getAllWorkflows();
    
    // Use appliance as the folder
    workflow.metadata.folder = workflow.metadata.appliance;
    
    // Find existing workflow by name and appliance
    const existingIndex = workflows.findIndex(w => 
      w.metadata.name === workflow.metadata.name && 
      w.metadata.appliance === workflow.metadata.appliance
    );

    if (existingIndex >= 0) {
      // Preserve creation date and active state when updating
      workflow.metadata.createdAt = workflows[existingIndex].metadata.createdAt;
      workflow.metadata.isActive = workflows[existingIndex].metadata.isActive;
      workflows[existingIndex] = workflow;
    } else {
      workflow.metadata.createdAt = new Date().toISOString();
      workflow.metadata.isActive = true;
      workflows.push(workflow);
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(workflows));
    return true;
  } catch (error) {
    console.error('Error saving workflow to storage:', error);
    return false;
  }
};
