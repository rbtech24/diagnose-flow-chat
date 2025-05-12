
import { SavedWorkflow } from '../../types';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export const moveWorkflowToFolder = async (workflow: SavedWorkflow, targetFolder: string): Promise<boolean> => {
  try {
    // Try to move in Supabase first
    try {
      // First find the target category or create it
      let { data: category } = await supabase
        .from('workflow_categories')
        .select('id')
        .eq('name', targetFolder)
        .maybeSingle();

      if (!category) {
        const { data: newCategory, error: createError } = await supabase
          .from('workflow_categories')
          .insert({ name: targetFolder })
          .select('id')
          .single();

        if (createError) throw createError;
        category = newCategory;
      }

      // Find the workflow by name to get its ID
      const { data: workflowData, error: findError } = await supabase
        .from('workflows')
        .select('id')
        .eq('name', workflow.metadata.name)
        .maybeSingle();
        
      if (findError) throw findError;

      if (workflowData) {
        // Update the workflow with the new category
        const { error } = await supabase
          .from('workflows')
          .update({ 
            category_id: category.id,
            updated_at: new Date().toISOString()
          })
          .eq('id', workflowData.id);

        if (error) throw error;
      } else {
        // If workflow doesn't exist in Supabase yet, we'll just update localStorage
        console.log('Workflow not found in Supabase, updating localStorage only');
      }
    } catch (error) {
      console.error('Error moving workflow in Supabase:', error);
      // Fallback to localStorage
    }

    // Update in localStorage as well
    const existingWorkflows = JSON.parse(localStorage.getItem('diagnostic-workflows') || '[]');
    const updatedWorkflows = existingWorkflows.map((w: SavedWorkflow) => {
      if (w.metadata.name === workflow.metadata.name && 
          (w.metadata.folder === workflow.metadata.folder || 
           w.metadata.appliance === workflow.metadata.appliance)) {
        return {
          ...w,
          metadata: {
            ...w.metadata,
            folder: targetFolder,
            appliance: targetFolder,
            updatedAt: new Date().toISOString()
          }
        };
      }
      return w;
    });

    localStorage.setItem('diagnostic-workflows', JSON.stringify(updatedWorkflows));
    
    // Dispatch a storage event to notify other components
    window.dispatchEvent(new StorageEvent('storage', {
      key: 'diagnostic-workflows',
      newValue: localStorage.getItem('diagnostic-workflows')
    }));
    
    return true;
  } catch (error) {
    console.error('Error moving workflow:', error);
    toast({
      title: "Error",
      description: "Failed to move workflow",
      variant: "destructive"
    });
    return false;
  }
};
