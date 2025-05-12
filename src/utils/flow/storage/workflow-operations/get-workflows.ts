
import { SavedWorkflow } from '../../types';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export const getAllWorkflows = async (): Promise<SavedWorkflow[]> => {
  try {
    // First try to get workflows from Supabase
    try {
      const { data, error } = await supabase
        .from('workflows')
        .select(`
          id, 
          name, 
          description, 
          flow_data, 
          is_active, 
          created_at, 
          updated_at,
          category:workflow_categories(id, name)
        `)
        .eq('is_active', true);
      
      if (error) throw error;
      
      if (data && data.length > 0) {
        // Transform Supabase data into SavedWorkflow format
        return data.map(item => {
          const flowData = item.flow_data || { nodes: [], edges: [], nodeCounter: 0 };
          return {
            metadata: {
              name: item.name,
              folder: item.category?.name || 'Default',
              appliance: item.category?.name || 'Default',
              createdAt: item.created_at,
              updatedAt: item.updated_at,
              isActive: item.is_active
            },
            nodes: flowData.nodes || [],
            edges: flowData.edges || [],
            nodeCounter: flowData.nodeCounter || 0
          };
        });
      }
    } catch (error) {
      console.error('Error getting all workflows:', error);
      // If Supabase fails, we'll just continue to check localStorage
    }
    
    // Fallback to localStorage if Supabase didn't return any data
    const storedWorkflows = localStorage.getItem('diagnostic-workflows');
    if (storedWorkflows) {
      const workflowsData = JSON.parse(storedWorkflows) as SavedWorkflow[];
      return workflowsData;
    }
    
    return []; // Return empty array if no workflows found
  } catch (error) {
    console.error('Error getting all workflows:', error);
    toast({
      title: "Error",
      description: "Failed to load workflows",
      variant: "destructive"
    });
    return []; // Return empty array on error
  }
};
