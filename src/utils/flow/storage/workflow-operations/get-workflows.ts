
import { SavedWorkflow } from '../../types';
import { supabase } from '@/integrations/supabase/client';

interface WorkflowData {
  nodes: any[];
  edges: any[];
  nodeCounter: number;
}

export const getAllWorkflows = async (): Promise<SavedWorkflow[]> => {
  try {
    const { data: workflows, error } = await supabase
      .from('workflows')
      .select(`
        *,
        workflow_categories (
          name
        )
      `)
      .eq('is_active', true)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    return workflows.map(workflow => {
      const flowData = workflow.flow_data as unknown as WorkflowData;
      return {
        metadata: {
          name: workflow.name,
          folder: workflow.workflow_categories?.name || 'Default',
          appliance: workflow.workflow_categories?.name || 'Default',
          createdAt: workflow.created_at,
          updatedAt: workflow.updated_at,
          isActive: workflow.is_active
        },
        nodes: flowData?.nodes || [],
        edges: flowData?.edges || [],
        nodeCounter: flowData?.nodeCounter || 0
      };
    });
  } catch (error) {
    console.error('Error getting all workflows:', error);
    return [];
  }
};

export const getWorkflowsInFolder = async (folder: string): Promise<SavedWorkflow[]> => {
  try {
    const { data: category } = await supabase
      .from('workflow_categories')
      .select('id')
      .eq('name', folder)
      .maybeSingle();
      
    if (!category) return [];
    
    const { data: workflows, error } = await supabase
      .from('workflows')
      .select(`
        *,
        workflow_categories (
          name
        )
      `)
      .eq('category_id', category.id)
      .eq('is_active', true);
      
    if (error) throw error;
    
    return workflows.map(workflow => {
      const flowData = workflow.flow_data as unknown as WorkflowData;
      return {
        metadata: {
          name: workflow.name,
          folder: workflow.workflow_categories?.name || 'Default',
          appliance: workflow.workflow_categories?.name || 'Default',
          createdAt: workflow.created_at,
          updatedAt: workflow.updated_at,
          isActive: workflow.is_active
        },
        nodes: flowData?.nodes || [],
        edges: flowData?.edges || [],
        nodeCounter: flowData?.nodeCounter || 0
      };
    });
  } catch (error) {
    console.error('Error getting workflows in folder:', error);
    return [];
  }
};
