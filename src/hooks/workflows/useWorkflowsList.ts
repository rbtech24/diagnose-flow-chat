
import { useState, useEffect, useCallback } from 'react';
import { toast } from '@/hooks/use-toast';
import { SavedWorkflow } from '@/utils/flow/types';
import { getAllWorkflows } from '@/utils/flow';
import { getFolders } from '@/utils/flow/storage/categories';

export function useWorkflowsList() {
  const [workflowsState, setWorkflowsState] = useState<SavedWorkflow[]>([]);
  const [selectedFolder, setSelectedFolder] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [foldersList, setFoldersList] = useState<string[]>([]);

  // Get all appliances from localStorage
  const getAppliances = () => {
    const appliancesData = localStorage.getItem('appliances-data');
    return appliancesData ? JSON.parse(appliancesData) : [];
  };

  const loadWorkflows = useCallback(async () => {
    setIsLoading(true);
    try {
      const workflows = await getAllWorkflows();
      setWorkflowsState(workflows);
      
      // Also refresh folders
      const folders = await getFolders();
      setFoldersList(folders);
    } catch (error) {
      console.error('Error loading workflows:', error);
      toast({
        title: "Error",
        description: "Failed to load workflows",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadWorkflows();
    
    // Listen for localStorage changes
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'diagnostic-workflows' || e.key === 'workflow-categories') {
        loadWorkflows();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [loadWorkflows]);

  // Generate folders list
  const folders = foldersList.length > 0 
    ? foldersList 
    : [...new Set([
        ...workflowsState.map(w => w.metadata?.folder || 'Default'),
        ...getAppliances().map((a: { name: string }) => a.name)
      ])]
        .filter(folder => folder && folder.trim() !== '')
        .sort();
  
  // Get workflows for the selected folder or all workflows if no folder is selected
  const workflows = selectedFolder 
    ? workflowsState.filter(w => w.metadata?.folder === selectedFolder)
    : workflowsState;

  return {
    workflows,
    workflowsState,
    setWorkflowsState,
    selectedFolder,
    setSelectedFolder,
    isLoading,
    folders,
    loadWorkflows
  };
}
