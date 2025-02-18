
import { supabase } from '@/integrations/supabase/client';
import { WorkflowQueryResult } from './types';

export const fetchAllWorkflows = async () => {
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
  return workflows as WorkflowQueryResult[];
};

export const fetchWorkflowsByFolder = async (categoryId: string) => {
  const { data: workflows, error } = await supabase
    .from('workflows')
    .select(`
      *,
      workflow_categories (
        name
      )
    `)
    .eq('category_id', categoryId)
    .eq('is_active', true);
    
  if (error) throw error;
  return workflows as WorkflowQueryResult[];
};

export const updateWorkflowCategory = async (workflowName: string, categoryId: string) => {
  const { error } = await supabase
    .from('workflows')
    .update({ 
      category_id: categoryId,
      updated_at: new Date().toISOString()
    })
    .eq('name', workflowName);
    
  if (error) throw error;
};

export const upsertWorkflow = async (workflowData: any) => {
  const { error } = await supabase
    .from('workflows')
    .upsert(workflowData)
    .select();
    
  if (error) throw error;
};
