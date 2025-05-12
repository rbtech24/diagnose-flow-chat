
import { supabase } from '@/integrations/supabase/client';
import { SavedWorkflow } from '../../types';
import { toast } from '@/hooks/use-toast';

export const moveWorkflowToFolder = async (workflow: SavedWorkflow, targetFolder: string): Promise<boolean> => {
  try {
    // First try to find the workflow in Supabase by name
    const { data, error: findError } = await supabase
      .from('workflows')
      .select('id')
      .eq('name', workflow.metadata.name)
      .maybeSingle();
      
    if (!findError && data) {
      // If found in Supabase, update the folder reference
      const { error } = await supabase
        .from('workflows')
        .update({
          category_id: targetFolder === 'Default' 
            ? null
            : await getCategoryId(targetFolder)
        })
        .eq('id', data.id);
        
      if (error) throw error;
    }
    
    // Also update localStorage
    const storedWorkflows = JSON.parse(localStorage.getItem('diagnostic-workflows') || '[]');
    const updatedWorkflows = storedWorkflows.map((w: SavedWorkflow) => {
      if (w.metadata.name === workflow.metadata.name && 
          w.metadata.folder === workflow.metadata.folder) {
        return {
          ...w,
          metadata: {
            ...w.metadata,
            folder: targetFolder
          }
        };
      }
      return w;
    });
    
    localStorage.setItem('diagnostic-workflows', JSON.stringify(updatedWorkflows));
    return true;
  } catch (error) {
    console.error('Error moving workflow to folder:', error);
    toast({
      title: "Error",
      description: "Failed to move workflow to folder",
      variant: "destructive"
    });
    return false;
  }
};

// Helper function to get category ID from name
const getCategoryId = async (categoryName: string): Promise<string | null> => {
  try {
    const { data, error } = await supabase
      .from('workflow_categories')
      .select('id')
      .eq('name', categoryName)
      .single();
      
    if (error) throw error;
    return data.id;
  } catch (error) {
    console.error('Error getting category ID:', error);
    return null;
  }
};
