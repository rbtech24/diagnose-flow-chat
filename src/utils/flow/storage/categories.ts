
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

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
    const categories = [...new Set(storedWorkflows.map((w: any) => w.metadata?.appliance || w.metadata?.folder || 'Default'))];
    return categories.filter((category): category is string => typeof category === 'string');
  } catch (error) {
    console.error('Error parsing localStorage workflow categories:', error);
    return [];
  }
};

export const getFolders = async (): Promise<string[]> => {
  return getWorkflowCategories();
};

export const addWorkflowCategory = async (name: string): Promise<boolean> => {
  try {
    // Try to add to Supabase first
    const { data, error } = await supabase
      .from('workflow_categories')
      .insert({ name })
      .select('id')
      .single();
    
    if (error) throw error;
    
    // Success in Supabase, trigger refresh
    window.dispatchEvent(new StorageEvent('storage', {
      key: 'workflow-categories',
      newValue: JSON.stringify(await getWorkflowCategories())
    }));
    
    return true;
  } catch (error) {
    console.error('Error adding workflow category:', error);
    toast({
      title: "Error",
      description: "Failed to add new folder",
      variant: "destructive"
    });
    return false;
  }
};

export const deleteWorkflowCategory = async (name: string): Promise<boolean> => {
  try {
    // Delete from Supabase
    const { error } = await supabase
      .from('workflow_categories')
      .delete()
      .eq('name', name);
    
    if (error) throw error;
    
    // Success in Supabase, trigger refresh
    window.dispatchEvent(new StorageEvent('storage', {
      key: 'workflow-categories',
      newValue: JSON.stringify(await getWorkflowCategories())
    }));
    
    return true;
  } catch (error) {
    console.error('Error deleting workflow category:', error);
    toast({
      title: "Error",
      description: "Failed to delete folder",
      variant: "destructive"
    });
    return false;
  }
};
