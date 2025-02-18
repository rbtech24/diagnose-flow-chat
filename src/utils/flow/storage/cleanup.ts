
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
