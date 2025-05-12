
import { SavedWorkflow } from '../../types';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export const saveWorkflowToStorage = async (workflow: SavedWorkflow): Promise<boolean> => {
  try {
    if (!workflow.metadata?.folder) {
      console.error('No folder specified for workflow');
      return false;
    }

    // Try to save to Supabase first
    try {
      // First get or create the category for the folder
      let categoryId = null;
      
      // Skip category lookup for Default folder
      if (workflow.metadata.folder !== 'Default') {
        // Check if category exists
        const { data: existingCategory, error: findCategoryError } = await supabase
          .from('workflow_categories')
          .select('id')
          .eq('name', workflow.metadata.folder)
          .maybeSingle();
        
        if (!findCategoryError && existingCategory) {
          categoryId = existingCategory.id;
        } else {
          // Create new category
          const { data: newCategory, error: createError } = await supabase
            .from('workflow_categories')
            .insert({ name: workflow.metadata.folder })
            .select('id')
            .single();

          if (createError) {
            console.error('Error creating category:', createError);
            throw createError;
          }
          
          categoryId = newCategory?.id;
        }
      }

      // First, check if the workflow already exists
      const { data: existingWorkflow } = await supabase
        .from('workflows')
        .select('id, name')
        .eq('name', workflow.metadata.name)
        .maybeSingle();

      // Prepare workflow data
      const flowData = {
        nodes: workflow.nodes,
        edges: workflow.edges,
        nodeCounter: workflow.nodeCounter
      };
      
      // Save workflow
      const { error } = await supabase
        .from('workflows')
        .upsert({
          id: existingWorkflow?.id,
          name: workflow.metadata.name,
          category_id: categoryId,
          description: workflow.metadata.description || '',
          flow_data: flowData,
          is_active: workflow.metadata.isActive ?? true,
          created_at: existingWorkflow ? undefined : new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select();

      if (error) {
        console.error('Error saving workflow to Supabase:', error);
        throw error;
      }
      
      console.log('Workflow saved to Supabase successfully');
    } catch (error) {
      console.error('Error saving workflow to Supabase:', error);
      
      // Continue execution - we'll fall back to localStorage
    }
    
    // Always save to localStorage for redundancy
    const existingWorkflows = JSON.parse(localStorage.getItem('diagnostic-workflows') || '[]');
    
    // Check if workflow already exists
    const existingIndex = existingWorkflows.findIndex(
      (w: SavedWorkflow) => 
        w.metadata.name === workflow.metadata.name && 
        (w.metadata.folder === workflow.metadata.folder || 
         w.metadata.appliance === workflow.metadata.folder)
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
    
    return true;
  } catch (error) {
    console.error('Error saving workflow to storage:', error);
    return false;
  }
};
