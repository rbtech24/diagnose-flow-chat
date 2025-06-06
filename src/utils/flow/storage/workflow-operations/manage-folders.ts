
import { toast } from '@/hooks/use-toast';
import { 
  addWorkflowCategory, 
  deleteWorkflowCategory, 
  renameWorkflowCategory 
} from '../categories';
import { moveWorkflowToFolder } from './move-workflow';
import { SavedWorkflow } from '@/utils/flow/types';
import { getAllWorkflows } from './get-workflows';

export const addFolder = async (name: string): Promise<boolean> => {
  console.log("addFolder function called with name:", name);
  if (!name || name.trim() === '') {
    toast({
      title: "Error",
      description: "Folder name cannot be empty",
      variant: "destructive"
    });
    return false;
  }

  const success = await addWorkflowCategory(name);
  console.log("addWorkflowCategory result:", success);
  if (success) {
    toast({
      title: "Success",
      description: `Folder "${name}" has been created`
    });
  } else {
    toast({
      title: "Error",
      description: "Failed to create folder",
      variant: "destructive"
    });
  }
  return success;
};

export const deleteFolder = async (name: string): Promise<boolean> => {
  console.log("deleteFolder function called with name:", name);
  if (name === 'Default') {
    toast({
      title: "Error",
      description: "Cannot delete the Default folder",
      variant: "destructive"
    });
    return false;
  }
  
  try {
    // Check for workflows in this folder
    const workflows = await getAllWorkflows();
    const workflowsInFolder = workflows.filter(w => 
      w.metadata.folder === name || 
      w.metadata.appliance === name
    );
    
    console.log(`Found ${workflowsInFolder.length} workflows in folder ${name}`);
    
    if (workflowsInFolder.length > 0) {
      // Ask user what to do with workflows
      if (confirm(`This folder contains ${workflowsInFolder.length} workflow(s). Do you want to move them to the Default folder? Click Cancel to delete them with the folder.`)) {
        // Move workflows to Default folder
        for (const workflow of workflowsInFolder) {
          await moveWorkflowToFolder(workflow, 'Default');
        }
        toast({
          title: "Info",
          description: `Moved ${workflowsInFolder.length} workflow(s) to Default folder`
        });
      }
    }
    
    // Delete the folder
    const success = await deleteWorkflowCategory(name);
    console.log("deleteWorkflowCategory result:", success);
    if (success) {
      toast({
        title: "Success",
        description: `Folder "${name}" has been deleted`
      });
    } else {
      toast({
        title: "Error",
        description: "Failed to delete folder",
        variant: "destructive"
      });
    }
    return success;
  } catch (error) {
    console.error('Error deleting folder:', error);
    toast({
      title: "Error",
      description: "Failed to delete folder",
      variant: "destructive"
    });
    return false;
  }
};

export const renameFolder = async (oldName: string, newName: string): Promise<boolean> => {
  console.log("renameFolder function called with oldName:", oldName, "newName:", newName);
  if (!newName || newName.trim() === '') {
    toast({
      title: "Error",
      description: "Folder name cannot be empty",
      variant: "destructive"
    });
    return false;
  }
  
  if (oldName === 'Default') {
    toast({
      title: "Error",
      description: "Cannot rename the Default folder",
      variant: "destructive"
    });
    return false;
  }
  
  try {
    // Create new folder
    const successAdd = await addWorkflowCategory(newName);
    console.log("addWorkflowCategory result:", successAdd);
    if (!successAdd) {
      toast({
        title: "Error",
        description: "Failed to create new folder",
        variant: "destructive"
      });
      return false;
    }
    
    // Get all workflows in old folder
    const workflows = await getAllWorkflows();
    const workflowsToMove = workflows.filter(w => 
      w.metadata.folder === oldName || 
      w.metadata.appliance === oldName
    );
    
    console.log(`Found ${workflowsToMove.length} workflows to move from ${oldName} to ${newName}`);
    
    // Move workflows to new folder
    for (const workflow of workflowsToMove) {
      const moveSuccess = await moveWorkflowToFolder(workflow, newName);
      console.log(`Moving workflow ${workflow.metadata.name} result: ${moveSuccess}`);
    }
    
    // Delete old folder
    const successDelete = await deleteWorkflowCategory(oldName);
    console.log("deleteWorkflowCategory result:", successDelete);
    if (!successDelete) {
      toast({
        title: "Warning",
        description: "Created new folder but could not delete the old one",
        variant: "destructive"
      });
      return false;
    }
    
    toast({
      title: "Success",
      description: `Folder renamed from "${oldName}" to "${newName}"`
    });
    return true;
  } catch (error) {
    console.error('Error renaming folder:', error);
    toast({
      title: "Error",
      description: "Failed to rename folder",
      variant: "destructive"
    });
    return false;
  }
};
