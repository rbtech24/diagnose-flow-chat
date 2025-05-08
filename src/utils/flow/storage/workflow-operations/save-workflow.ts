
import { SavedWorkflow } from '../../types';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export const saveWorkflowToStorage = async (workflow: SavedWorkflow): Promise<boolean> => {
  try {
    if (!workflow.metadata?.appliance) {
      console.error('No appliance specified for workflow');
      return false;
    }

    // Try to save to Supabase first
    try {
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
    } catch (error) {
      console.error('Error saving workflow to Supabase:', error);
      
      // Fallback to localStorage if Supabase fails
      const existingWorkflows = JSON.parse(localStorage.getItem('diagnostic-workflows') || '[]');
      
      // Check if workflow already exists
      const existingIndex = existingWorkflows.findIndex(
        (w: SavedWorkflow) => 
          w.metadata.name === workflow.metadata.name && 
          w.metadata.folder === workflow.metadata.folder
      );
      
      if (existingIndex >= 0) {
        // Update existing workflow
        existingWorkflows[existingIndex] = {
          ...workflow,
          metadata: {
            ...workflow.metadata,
            updatedAt: new Date().toISOString()
          }
        };
      } else {
        // Add new workflow
        existingWorkflows.push({
          ...workflow,
          metadata: {
            ...workflow.metadata,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
        });
      }
      
      localStorage.setItem('diagnostic-workflows', JSON.stringify(existingWorkflows));
    }
    
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
