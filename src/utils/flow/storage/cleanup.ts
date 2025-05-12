
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { getAllWorkflows } from './workflow-operations/get-workflows';
import { getFolders } from './categories';
import { SavedWorkflow } from '@/utils/flow/types';

// Clean up workflows that don't have associated folders
export const cleanupOrphanedWorkflows = async (): Promise<void> => {
  try {
    const workflows = await getAllWorkflows();
    const categories = await getFolders();
    
    // Add 'Default' to categories if it doesn't exist
    if (!categories.includes('Default')) {
      categories.push('Default');
    }
    
    // Filter workflows that have folders not in the categories list
    const orphanedWorkflows = workflows.filter(workflow => {
      const folder = workflow.metadata?.folder || 'Default';
      return !categories.includes(folder);
    });
    
    if (orphanedWorkflows.length > 0) {
      console.log(`Found ${orphanedWorkflows.length} orphaned workflows`);
      
      // Move orphaned workflows to Default folder
      for (const workflow of orphanedWorkflows) {
        try {
          // Check if the workflow has a database id in metadata
          const workflowDbId = workflow.metadata?.dbId;
          
          // Update in Supabase if we have a DB ID
          if (workflowDbId) {
            // Prepare the flow data for Supabase in the correct format
            // Convert the workflow to a JSON string for Supabase
            const flowDataJson = JSON.stringify({
              ...workflow,
              metadata: { ...workflow.metadata, folder: 'Default' }
            });
            
            const { error } = await supabase
              .from('workflows')
              .update({ 
                flow_data: flowDataJson
              })
              .eq('id', workflowDbId);
            
            if (error) {
              console.error('Error updating workflow in Supabase:', error);
            }
          }
          
          // Update in localStorage
          const storedWorkflows = JSON.parse(localStorage.getItem('diagnostic-workflows') || '[]');
          const updatedWorkflows = storedWorkflows.map((w: any) => {
            if (w.metadata?.name === workflow.metadata?.name && 
                (w.metadata?.folder === workflow.metadata?.folder || 
                 w.metadata?.appliance === workflow.metadata?.folder)) {
              return {
                ...w,
                metadata: {
                  ...w.metadata,
                  folder: 'Default'
                }
              };
            }
            return w;
          });
          
          localStorage.setItem('diagnostic-workflows', JSON.stringify(updatedWorkflows));
          
        } catch (error) {
          console.error('Error moving orphaned workflow to Default folder:', error);
        }
      }
      
      toast({
        title: 'Cleanup Complete',
        description: `Moved ${orphanedWorkflows.length} workflows to Default folder`
      });
    }
  } catch (error) {
    console.error('Error in cleanupOrphanedWorkflows:', error);
    toast({
      title: 'Cleanup Error',
      description: 'Failed to check for orphaned workflows',
      variant: 'destructive'
    });
  }
};

// Clean up empty folders
export const cleanupEmptyFolders = async (): Promise<void> => {
  try {
    const workflows = await getAllWorkflows();
    const categories = await getFolders();
    
    // Skip the Default folder, it should always exist
    const foldersToCheck = categories.filter(cat => cat !== 'Default');
    
    const emptyFolders = foldersToCheck.filter(folder => {
      return !workflows.some(workflow => workflow.metadata?.folder === folder);
    });
    
    if (emptyFolders.length > 0) {
      console.log(`Found ${emptyFolders.length} empty folders`);
      
      // Delete empty folders
      for (const folder of emptyFolders) {
        try {
          // Delete from Supabase
          const { data: categoryData, error: findError } = await supabase
            .from('workflow_categories')
            .select('id')
            .eq('name', folder)
            .maybeSingle();
          
          if (!findError && categoryData) {
            const { error: deleteError } = await supabase
              .from('workflow_categories')
              .delete()
              .eq('id', categoryData.id);
            
            if (deleteError) {
              console.error('Error deleting empty folder from Supabase:', deleteError);
            }
          }
        } catch (error) {
          console.error(`Error deleting empty folder "${folder}":`, error);
        }
      }
      
      toast({
        title: 'Cleanup Complete',
        description: `Removed ${emptyFolders.length} empty folders`
      });
    }
  } catch (error) {
    console.error('Error in cleanupEmptyFolders:', error);
    toast({
      title: 'Cleanup Error',
      description: 'Failed to check for empty folders',
      variant: 'destructive'
    });
  }
};
