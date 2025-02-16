
import { toast } from '@/hooks/use-toast';
import { SavedWorkflow } from './types';

export const cleanupWorkflows = () => {
  const storedWorkflows = localStorage.getItem('diagnostic-workflows') || '[]';
  const workflows = JSON.parse(storedWorkflows);
  const cleanedWorkflows = workflows.filter(workflow => workflow.nodes.length > 0);
  localStorage.setItem('diagnostic-workflows', JSON.stringify(cleanedWorkflows));
  return cleanedWorkflows;
};

export const getFolders = (): string[] => {
  const workflows = cleanupWorkflows();
  const folderSet = new Set<string>();
  
  workflows.forEach(workflow => {
    if (workflow.metadata?.folder && workflow.nodes.length > 0) {
      folderSet.add(workflow.metadata.folder);
    }
  });
  
  return Array.from(folderSet).sort();
};

export const getAllWorkflows = (): SavedWorkflow[] => {
  return cleanupWorkflows();
};

export const getWorkflowsInFolder = (folder: string): SavedWorkflow[] => {
  const workflows = getAllWorkflows();
  console.log('Getting workflows for folder:', folder);
  console.log('All workflows:', workflows);
  const folderWorkflows = workflows.filter(w => w.metadata.folder === folder);
  console.log(`Found ${folderWorkflows.length} workflows in folder ${folder}`);
  return folderWorkflows;
};
