
import { SavedWorkflow } from '../types';
import { supabase } from '@/integrations/supabase/client';

export class WorkflowPersistence {
  private static readonly STORAGE_KEY = 'diagnostic-workflows';
  private static readonly BACKUP_KEY = 'diagnostic-workflows-backup';

  static async saveWorkflow(workflow: SavedWorkflow): Promise<boolean> {
    try {
      // Try Supabase first
      const supabaseSuccess = await this.saveToSupabase(workflow);
      
      // Always save to localStorage as backup
      const localSuccess = this.saveToLocalStorage(workflow);
      
      return supabaseSuccess || localSuccess;
    } catch (error) {
      console.error('Error saving workflow:', error);
      return this.saveToLocalStorage(workflow);
    }
  }

  static async loadWorkflows(): Promise<SavedWorkflow[]> {
    try {
      // Try Supabase first
      const supabaseWorkflows = await this.loadFromSupabase();
      if (supabaseWorkflows.length > 0) {
        // Sync with localStorage
        this.syncToLocalStorage(supabaseWorkflows);
        return supabaseWorkflows;
      }
      
      // Fallback to localStorage
      return this.loadFromLocalStorage();
    } catch (error) {
      console.error('Error loading workflows:', error);
      return this.loadFromLocalStorage();
    }
  }

  private static async saveToSupabase(workflow: SavedWorkflow): Promise<boolean> {
    try {
      let categoryId = null;
      
      if (workflow.metadata.folder !== 'Default') {
        const { data: category } = await supabase
          .from('workflow_categories')
          .select('id')
          .eq('name', workflow.metadata.folder)
          .maybeSingle();
          
        if (!category) {
          const { data: newCategory } = await supabase
            .from('workflow_categories')
            .insert({ name: workflow.metadata.folder })
            .select('id')
            .single();
          categoryId = newCategory?.id;
        } else {
          categoryId = category.id;
        }
      }

      const flowData = JSON.stringify({
        nodes: workflow.nodes,
        edges: workflow.edges,
        nodeCounter: workflow.nodeCounter
      });

      const { error } = await supabase
        .from('workflows')
        .upsert({
          name: workflow.metadata.name,
          category_id: categoryId,
          description: workflow.metadata.description || '',
          flow_data: flowData,
          is_active: workflow.metadata.isActive ?? true,
          updated_at: new Date().toISOString()
        });

      return !error;
    } catch (error) {
      console.error('Supabase save error:', error);
      return false;
    }
  }

  private static async loadFromSupabase(): Promise<SavedWorkflow[]> {
    try {
      const { data, error } = await supabase
        .from('workflows')
        .select(`
          id, name, description, flow_data, is_active, created_at, updated_at,
          category:workflow_categories(id, name)
        `)
        .eq('is_active', true);

      if (error) throw error;

      return (data || []).map(item => {
        const flowData = typeof item.flow_data === 'string' 
          ? JSON.parse(item.flow_data) 
          : item.flow_data || { nodes: [], edges: [], nodeCounter: 0 };

        return {
          metadata: {
            name: item.name,
            folder: item.category?.name || 'Default',
            appliance: item.category?.name || 'Default',
            description: item.description,
            createdAt: item.created_at,
            updatedAt: item.updated_at,
            isActive: item.is_active,
            dbId: item.id
          },
          nodes: flowData.nodes || [],
          edges: flowData.edges || [],
          nodeCounter: flowData.nodeCounter || 0
        };
      });
    } catch (error) {
      console.error('Supabase load error:', error);
      return [];
    }
  }

  private static saveToLocalStorage(workflow: SavedWorkflow): boolean {
    try {
      const existing = this.loadFromLocalStorage();
      const index = existing.findIndex(w => 
        w.metadata.name === workflow.metadata.name && 
        w.metadata.folder === workflow.metadata.folder
      );

      if (index >= 0) {
        existing[index] = {
          ...workflow,
          metadata: { ...workflow.metadata, updatedAt: new Date().toISOString() }
        };
      } else {
        existing.push({
          ...workflow,
          metadata: {
            ...workflow.metadata,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
        });
      }

      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(existing));
      
      // Create backup
      localStorage.setItem(this.BACKUP_KEY, JSON.stringify(existing));
      
      return true;
    } catch (error) {
      console.error('localStorage save error:', error);
      return false;
    }
  }

  private static loadFromLocalStorage(): SavedWorkflow[] {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('localStorage load error:', error);
      // Try backup
      try {
        const backup = localStorage.getItem(this.BACKUP_KEY);
        return backup ? JSON.parse(backup) : [];
      } catch (backupError) {
        console.error('Backup load error:', backupError);
        return [];
      }
    }
  }

  private static syncToLocalStorage(workflows: SavedWorkflow[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(workflows));
    } catch (error) {
      console.error('Sync to localStorage error:', error);
    }
  }
}
