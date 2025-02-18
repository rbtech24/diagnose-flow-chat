
import { SavedWorkflow } from '../../types';
import { supabase } from '@/integrations/supabase/client';

export const moveWorkflowToFolder = async (
  workflow: SavedWorkflow,
  targetAppliance: string
): Promise<boolean> => {
  try {
    // First get or create the category
    const { data: category } = await supabase
      .from('workflow_categories')
      .select('id')
      .eq('name', targetAppliance)
      .maybeSingle();

    let categoryId;
    if (!category) {
      const { data: newCategory, error: createError } = await supabase
        .from('workflow_categories')
        .insert({ name: targetAppliance })
        .select('id')
        .single();

      if (createError) throw createError;
      categoryId = newCategory.id;
    } else {
      categoryId = category.id;
    }
    
    // Update workflow
    const { error } = await supabase
      .from('workflows')
      .update({ 
        category_id: categoryId,
        updated_at: new Date().toISOString()
      })
      .eq('name', workflow.metadata.name);
      
    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error('Error moving workflow to folder:', error);
    return false;
  }
};
