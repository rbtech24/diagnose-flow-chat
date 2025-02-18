
import { supabase } from '@/integrations/supabase/client';

export interface Category {
  id: string;
  name: string;
}

export const getOrCreateCategory = async (name: string): Promise<Category | null> => {
  try {
    let { data: category } = await supabase
      .from('workflow_categories')
      .select('id, name')
      .eq('name', name)
      .single();
      
    if (!category) {
      const { data: newCategory, error: createError } = await supabase
        .from('workflow_categories')
        .insert({ name })
        .select('id, name')
        .single();
        
      if (createError) throw createError;
      category = newCategory;
    }
    
    return category;
  } catch (error) {
    console.error('Error getting or creating category:', error);
    return null;
  }
};

export const getFolders = async (): Promise<string[]> => {
  try {
    const { data: workflows, error } = await supabase
      .from('workflows')
      .select('category_id, workflow_categories(name)')
      .eq('is_active', true);
    
    if (error) throw error;
    
    const folderSet = new Set<string>();
    workflows?.forEach(workflow => {
      if (workflow.workflow_categories?.name) {
        folderSet.add(workflow.workflow_categories.name);
      }
    });
    
    return Array.from(folderSet).sort();
  } catch (error) {
    console.error('Error getting folders:', error);
    return [];
  }
};
