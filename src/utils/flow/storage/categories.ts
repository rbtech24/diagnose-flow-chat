
import { supabase } from '@/integrations/supabase/client';

export const getWorkflowCategories = async (): Promise<string[]> => {
  try {
    // Try to get from Supabase first
    const { data, error } = await supabase
      .from('workflow_categories')
      .select('name');
    
    if (!error && data && data.length > 0) {
      return data.map(category => category.name);
    }
  } catch (error) {
    console.error('Error getting workflow categories:', error);
  }
  
  // Fallback to localStorage
  try {
    const storedWorkflows = JSON.parse(localStorage.getItem('diagnostic-workflows') || '[]');
    return [...new Set(storedWorkflows.map((w: any) => w.metadata?.appliance || w.metadata?.folder || 'Default'))];
  } catch (error) {
    console.error('Error parsing localStorage workflow categories:', error);
    return [];
  }
};

export const getFolders = async (): Promise<string[]> => {
  return getWorkflowCategories();
};
