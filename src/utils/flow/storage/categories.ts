
import { supabase } from '@/integrations/supabase/client';
import { loadWorkflows, saveWorkflow } from '.';
import { toast } from '@/hooks/use-toast';

export const getFolders = async (): Promise<string[]> => {
  try {
    // Try to get categories from Supabase
    try {
      const { data: categories, error } = await supabase
        .from('workflow_categories')
        .select('name');
      
      if (error) {
        console.error('Error fetching categories from Supabase:', error);
        throw error;
      }
      
      if (categories && categories.length > 0) {
        return categories.map(cat => cat.name);
      }
    } catch (error) {
      console.error('Error in Supabase fetch:', error);
      // Continue to localStorage fallback
    }
    
    // Fallback to localStorage
    console.log('Falling back to localStorage for categories');
    const workflowsData = localStorage.getItem('diagnostic-workflows');
    if (!workflowsData) return [];
    
    const workflows = JSON.parse(workflowsData);
    const folders = new Set<string>();
    
    // Collect folder names from workflows
    workflows.forEach((workflow) => {
      if (workflow.metadata?.folder) {
        folders.add(workflow.metadata.folder);
      } else if (workflow.metadata?.appliance) {
        folders.add(workflow.metadata.appliance);
      }
    });
    
    return [...folders];
  } catch (error) {
    console.error('Error getting folders:', error);
    return [];
  }
};

export const createFolder = async (name: string): Promise<boolean> => {
  if (!name || name.trim() === '') return false;
  
  try {
    // Try to create category in Supabase
    try {
      const { error } = await supabase
        .from('workflow_categories')
        .insert({ name: name.trim() });
      
      if (error) {
        console.error('Error creating category in Supabase:', error);
        throw error;
      }
      
      return true;
    } catch (error) {
      console.error('Failed to create folder in Supabase, falling back to local:', error);
      toast({
        title: "Warning",
        description: "Created folder locally only. May not sync with the server.",
        variant: "warning"
      });
      // Continue and create locally
    }
    
    // No need to do anything with localStorage - folders are derived from workflow metadata
    return true;
  } catch (error) {
    console.error('Error creating folder:', error);
    return false;
  }
};

export const deleteFolder = async (name: string): Promise<boolean> => {
  if (!name || name.trim() === '') return false;
  
  try {
    // Try to delete from Supabase
    try {
      // First get the category ID
      const { data: categoryData, error: findError } = await supabase
        .from('workflow_categories')
        .select('id')
        .eq('name', name)
        .maybeSingle();
      
      if (findError) {
        console.error('Error finding category to delete:', findError);
        throw findError;
      }
      
      if (categoryData) {
        // Delete the category
        const { error: deleteError } = await supabase
          .from('workflow_categories')
          .delete()
          .eq('id', categoryData.id);
        
        if (deleteError) {
          console.error('Error deleting category from Supabase:', deleteError);
          throw deleteError;
        }
      }
    } catch (error) {
      console.error('Failed to delete folder in Supabase, falling back to local:', error);
      // Continue to delete locally
    }
    
    // Delete from localStorage too
    try {
      const workflows = await loadWorkflows();
      const updatedWorkflows = workflows.filter(workflow => 
        workflow.metadata?.folder !== name && workflow.metadata?.appliance !== name
      );
      
      // Save the updated workflows list
      localStorage.setItem('diagnostic-workflows', JSON.stringify(updatedWorkflows));
      
      return true;
    } catch (e) {
      console.error('Error deleting folder from localStorage:', e);
      return false;
    }
  } catch (error) {
    console.error('Error deleting folder:', error);
    return false;
  }
};

export const renameFolder = async (oldName: string, newName: string): Promise<boolean> => {
  if (!oldName || !newName || oldName.trim() === '' || newName.trim() === '') return false;
  
  try {
    // Try to rename in Supabase
    try {
      // First get the category ID
      const { data: categoryData, error: findError } = await supabase
        .from('workflow_categories')
        .select('id')
        .eq('name', oldName)
        .maybeSingle();
      
      if (findError) {
        console.error('Error finding category to rename:', findError);
        throw findError;
      }
      
      if (categoryData) {
        // Update the category name
        const { error: updateError } = await supabase
          .from('workflow_categories')
          .update({ name: newName.trim() })
          .eq('id', categoryData.id);
        
        if (updateError) {
          console.error('Error renaming category in Supabase:', updateError);
          throw updateError;
        }
      }
    } catch (error) {
      console.error('Failed to rename folder in Supabase, falling back to local:', error);
      // Continue to rename locally
    }
    
    // Rename in localStorage
    try {
      const workflows = await loadWorkflows();
      
      const updatedWorkflows = workflows.map(workflow => {
        if (workflow.metadata?.folder === oldName) {
          return {
            ...workflow,
            metadata: {
              ...workflow.metadata,
              folder: newName.trim()
            }
          };
        }
        if (workflow.metadata?.appliance === oldName) {
          return {
            ...workflow,
            metadata: {
              ...workflow.metadata,
              appliance: newName.trim()
            }
          };
        }
        return workflow;
      });
      
      // Save the updated workflows list
      localStorage.setItem('diagnostic-workflows', JSON.stringify(updatedWorkflows));
      
      return true;
    } catch (e) {
      console.error('Error renaming folder in localStorage:', e);
      return false;
    }
  } catch (error) {
    console.error('Error renaming folder:', error);
    return false;
  }
};
