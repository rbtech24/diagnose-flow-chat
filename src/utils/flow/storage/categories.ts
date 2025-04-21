
import { supabase } from '@/integrations/supabase/client';

export interface Category {
  id: string;
  name: string;
}

export const getOrCreateCategory = async (name: string): Promise<Category | null> => {
  try {
    // First try to get the category
    const { data: existingCategory, error: fetchError } = await supabase
      .from('workflow_categories')
      .select('id, name')
      .eq('name', name)
      .maybeSingle();
      
    if (existingCategory) {
      return existingCategory;
    }

    // If category doesn't exist, get the user's company_id
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (!user) {
      console.error('No user found');
      return null;
    }

    const { data: userInfo, error: techError } = await supabase
      .from('technicians')
      .select('company_id')
      .eq('id', user.id)
      .single();
      
    if (techError) {
      console.error('Error getting user company:', techError);
      return null;
    }

    // Create new category with company_id
    const { data: newCategory, error: createError } = await supabase
      .from('workflow_categories')
      .insert({ 
        name,
        company_id: userInfo.company_id,
        is_active: true
      })
      .select('id, name')
      .single();
        
    if (createError) {
      console.error('Error creating category:', createError);
      return null;
    }

    return newCategory;
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
    
    if (error) {
      console.error('Error getting folders:', error);
      return [];
    }
    
    const folderSet = new Set<string>();
    
    workflows?.forEach(workflow => {
      // Fix: properly type check and access the workflow_categories property
      if (workflow.workflow_categories && typeof workflow.workflow_categories === 'object') {
        // Access the name directly from the object (not as an array)
        const categoryName = workflow.workflow_categories.name;
        if (categoryName) {
          folderSet.add(categoryName);
        }
      }
    });
    
    return Array.from(folderSet).sort();
  } catch (error) {
    console.error('Error getting folders:', error);
    return [];
  }
};
