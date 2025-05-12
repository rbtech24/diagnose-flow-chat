
// Utility functions for cleaning up workflow data
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { getAllWorkflows } from './workflow-operations/get-workflows';
import { getWorkflowCategories } from './categories';

export const cleanupOrphanedWorkflows = async (): Promise<void> => {
  // This would be used to clean up workflows that no longer have a valid category
  // or are otherwise in an inconsistent state
  
  try {
    const workflows = await getAllWorkflows();
    const categories = await getWorkflowCategories();
    
    // Find workflows with categories that no longer exist
    const orphanedWorkflows = workflows.filter(
      w => w.metadata.folder && 
      w.metadata.folder !== 'Default' && 
      !categories.includes(w.metadata.folder)
    );
    
    if (orphanedWorkflows.length > 0) {
      // Move orphaned workflows to Default folder
      for (const workflow of orphanedWorkflows) {
        try {
          // Find workflow in Supabase
          const { data: workflowData } = await supabase
            .from('workflows')
            .select('id')
            .eq('name', workflow.metadata.name)
            .maybeSingle();
            
          if (workflowData) {
            // Update workflow to use Default category
            await supabase
              .from('workflows')
              .update({ 
                category_id: null,
                updated_at: new Date().toISOString()
              })
              .eq('id', workflowData.id);
          }
        } catch (error) {
          console.error('Error updating orphaned workflow:', error);
        }
      }
      
      // Update localStorage
      const existingWorkflows = JSON.parse(localStorage.getItem('diagnostic-workflows') || '[]');
      const updatedWorkflows = existingWorkflows.map((w: any) => {
        if (w.metadata?.folder && 
            w.metadata.folder !== 'Default' && 
            !categories.includes(w.metadata.folder)) {
          return {
            ...w,
            metadata: {
              ...w.metadata,
              folder: 'Default',
              appliance: 'Default',
              updatedAt: new Date().toISOString()
            }
          };
        }
        return w;
      });
      
      localStorage.setItem('diagnostic-workflows', JSON.stringify(updatedWorkflows));
      
      toast({
        title: "Cleanup Complete",
        description: `Moved ${orphanedWorkflows.length} orphaned workflow(s) to Default folder`
      });
    }
  } catch (error) {
    console.error('Error cleaning up orphaned workflows:', error);
  }
  
  return Promise.resolve();
};

export const cleanupEmptyFolders = async (): Promise<void> => {
  try {
    const workflows = await getAllWorkflows();
    const categories = await getWorkflowCategories();
    
    // Find empty categories (except Default)
    const usedCategories = [...new Set(workflows.map(w => w.metadata.folder))];
    const emptyCategories = categories.filter(
      c => c !== 'Default' && !usedCategories.includes(c)
    );
    
    // Delete empty categories from Supabase
    if (emptyCategories.length > 0) {
      for (const category of emptyCategories) {
        await supabase
          .from('workflow_categories')
          .delete()
          .eq('name', category);
      }
      
      toast({
        title: "Cleanup Complete",
        description: `Removed ${emptyCategories.length} empty folder(s)`
      });
    }
  } catch (error) {
    console.error('Error cleaning up empty folders:', error);
  }
  
  return Promise.resolve();
};
