
import { toast } from '@/hooks/use-toast';
import { SavedWorkflow } from '../types';
import { supabase } from '@/integrations/supabase/client';
import { getOrCreateCategory } from './categories';

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

export const saveWorkflowToStorage = async (workflow: SavedWorkflow): Promise<boolean> => {
  try {
    if (!workflow.metadata?.appliance) {
      console.error('No appliance specified for workflow');
      return false;
    }

    // First get or create the category
    const { data: category } = await supabase
      .from('workflow_categories')
      .select('id')
      .eq('name', workflow.metadata.appliance)
      .maybeSingle();

    let categoryId;
    if (!category) {
      const { data: newCategory, error: createError } = await supabase
        .from('workflow_categories')
        .insert({ name: workflow.metadata.appliance })
        .select('id')
        .single();

      if (createError) throw createError;
      categoryId = newCategory.id;
    } else {
      categoryId = category.id;
    }

    // First, check if the workflow already exists
    const { data: existingWorkflow } = await supabase
      .from('workflows')
      .select('id, name')
      .eq('name', workflow.metadata.name)
      .maybeSingle();

    // Save workflow
    const { error } = await supabase
      .from('workflows')
      .upsert({
        id: existingWorkflow?.id,
        name: workflow.metadata.name,
        category_id: categoryId,
        description: '',
        flow_data: JSON.parse(JSON.stringify({
          nodes: workflow.nodes,
          edges: workflow.edges,
          nodeCounter: workflow.nodeCounter
        })),
        is_active: workflow.metadata.isActive ?? true,
        created_at: existingWorkflow ? undefined : new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select();

    if (error) throw error;
    
    toast({
      title: "Success",
      description: "Workflow saved successfully"
    });
    
    return true;
  } catch (error) {
    console.error('Error saving workflow to storage:', error);
    toast({
      title: "Error",
      description: "Failed to save workflow",
      variant: "destructive"
    });
    return false;
  }
};
