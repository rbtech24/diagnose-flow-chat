
import { toast } from '@/hooks/use-toast';
import { SavedWorkflow, WorkflowData } from './types';
import { supabase } from '@/integrations/supabase/client';

export const cleanupWorkflows = async () => {
  try {
    const { data: workflows, error } = await supabase
      .from('workflows')
      .select('*')
      .eq('is_active', true);
      
    if (error) throw error;
    return workflows || [];
  } catch (error) {
    console.error('Error cleaning up workflows:', error);
    return [];
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

export const getAllWorkflows = async (): Promise<SavedWorkflow[]> => {
  try {
    const { data: workflows, error } = await supabase
      .from('workflows')
      .select('*, workflow_categories(name)')
      .eq('is_active', true)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    return workflows.map(workflow => ({
      metadata: {
        name: workflow.name,
        folder: workflow.workflow_categories?.name || 'Default',
        appliance: workflow.workflow_categories?.name || 'Default',
        createdAt: workflow.created_at,
        updatedAt: workflow.updated_at,
        isActive: workflow.is_active
      },
      ...workflow.flow_data
    }));
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
      .single();
      
    if (!category) return [];
    
    const { data: workflows, error } = await supabase
      .from('workflows')
      .select('*, workflow_categories(name)')
      .eq('category_id', category.id)
      .eq('is_active', true);
      
    if (error) throw error;
    
    return workflows.map(workflow => ({
      metadata: {
        name: workflow.name,
        folder: workflow.workflow_categories?.name || 'Default',
        appliance: workflow.workflow_categories?.name || 'Default',
        createdAt: workflow.created_at,
        updatedAt: workflow.updated_at,
        isActive: workflow.is_active
      },
      ...workflow.flow_data
    }));
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
    // Get or create category
    let { data: category } = await supabase
      .from('workflow_categories')
      .select('id')
      .eq('name', targetAppliance)
      .single();
      
    if (!category) {
      const { data: newCategory, error: createError } = await supabase
        .from('workflow_categories')
        .insert({ name: targetAppliance })
        .select('id')
        .single();
        
      if (createError) throw createError;
      category = newCategory;
    }
    
    // Update workflow
    const { error } = await supabase
      .from('workflows')
      .update({ 
        category_id: category.id,
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

    // Get or create category
    let { data: category } = await supabase
      .from('workflow_categories')
      .select('id')
      .eq('name', workflow.metadata.appliance)
      .single();
      
    if (!category) {
      const { data: newCategory, error: createError } = await supabase
        .from('workflow_categories')
        .insert({ name: workflow.metadata.appliance })
        .select('id')
        .single();
        
      if (createError) throw createError;
      category = newCategory;
    }

    // Prepare workflow data
    const workflowData: WorkflowData = {
      name: workflow.metadata.name,
      category_id: category.id,
      description: '',
      flow_data: {
        metadata: workflow.metadata,
        nodes: workflow.nodes,
        edges: workflow.edges,
        nodeCounter: workflow.nodeCounter
      },
      is_active: workflow.metadata.isActive ?? true,
    };

    // Save workflow
    const { error } = await supabase
      .from('workflows')
      .upsert(workflowData)
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
