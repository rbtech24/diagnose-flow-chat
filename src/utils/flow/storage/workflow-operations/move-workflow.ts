
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
      // Find or create target category if not "Default"
      let categoryId = null;
      if (targetFolder !== 'Default') {
        // Check if category exists
        const { data: categoryData, error: categoryError } = await supabase
          .from('workflow_categories')
          .select('id')
          .eq('name', targetFolder)
          .maybeSingle();
          
        if (categoryError) throw categoryError;
        
        // If category doesn't exist, create it
        if (!categoryData) {
          const { data: newCategory, error: createError } = await supabase
            .from('workflow_categories')
            .insert({ name: targetFolder })
            .select('id')
            .single();
            
          if (createError) throw createError;
          categoryId = newCategory.id;
        } else {
          categoryId = categoryData.id;
        }
      }
      
      // Update the workflow with new category_id
      const { error } = await supabase
        .from('workflows')
        .update({
          category_id: categoryId // null for Default folder
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
            folder: targetFolder,
            appliance: targetFolder // Also update appliance field for compatibility
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
