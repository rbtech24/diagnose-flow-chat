
import { Node, Edge } from '@xyflow/react';
import { toast } from 'react-hot-toast';
import { SavedWorkflow } from './types';
import { getAllWorkflows, saveWorkflowToStorage } from './storage';

export const handleQuickSave = async (
  nodes: Node[],
  edges: Edge[],
  nodeCounter: number,
  currentWorkflow: SavedWorkflow
) => {
  if (!currentWorkflow?.metadata?.appliance) {
    toast.error("No appliance selected for quick save");
    return;
  }

  return handleSaveWorkflow(
    nodes,
    edges,
    nodeCounter,
    currentWorkflow.metadata.name,
    currentWorkflow.metadata.appliance,
    currentWorkflow.metadata.appliance
  );
};

export const handleSaveWorkflow = async (
  nodes: Node[], 
  edges: Edge[], 
  nodeCounter: number,
  name: string,
  folder: string,
  appliance: string,
  symptom?: string
) => {
  if (!name || !appliance) {
    toast.error("Workflow name and appliance are required");
    return null;
  }

  try {
    const existingWorkflows = JSON.parse(localStorage.getItem('diagnostic-workflows') || '[]');
    
    const newWorkflow: SavedWorkflow = {
      metadata: {
        name,
        folder,
        appliance,
        symptom,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isActive: true
      },
      nodes,
      edges,
      nodeCounter
    };

    // Find existing workflow by name and appliance
    const existingIndex = existingWorkflows.findIndex(
      (w: SavedWorkflow) => 
      w.metadata.name === name && 
      (w.metadata.folder === folder || w.metadata.appliance === appliance)
    );

    let workflowToSave: SavedWorkflow;
    
    if (existingIndex >= 0) {
      const updatedWorkflows = [...existingWorkflows];
      workflowToSave = {
        ...newWorkflow,
        metadata: {
          ...newWorkflow.metadata,
          createdAt: existingWorkflows[existingIndex].metadata.createdAt,
          isActive: existingWorkflows[existingIndex].metadata.isActive
        }
      };
      updatedWorkflows[existingIndex] = workflowToSave;
      localStorage.setItem('diagnostic-workflows', JSON.stringify(updatedWorkflows));
    } else {
      workflowToSave = newWorkflow;
      existingWorkflows.push(workflowToSave);
      localStorage.setItem('diagnostic-workflows', JSON.stringify(existingWorkflows));
    }
    
    // Try to save to Supabase as well (this could fail but we already saved to localStorage)
    await saveWorkflowToStorage(workflowToSave);
    
    // Dispatch a storage event to notify other components
    window.dispatchEvent(new StorageEvent('storage', {
      key: 'diagnostic-workflows',
      newValue: localStorage.getItem('diagnostic-workflows')
    }));
    
    toast.success(`${name} has been saved to ${appliance} workflows.`);
    
    return workflowToSave;
  } catch (error) {
    console.error('Error saving workflow:', error);
    toast.error("Failed to save workflow. Please try again.");
    throw error;
  }
};

export const handleImportWorkflow = (
  file: File,
  setNodes: (nodes: Node[]) => void,
  setEdges: (edges: Edge[]) => void,
  setNodeCounter: (counter: number) => void
) => {
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const workflow = JSON.parse(e.target?.result as string);
      setNodes(workflow.nodes);
      setEdges(workflow.edges);
      setNodeCounter(workflow.nodeCounter || workflow.nodes.length + 1);
      toast.success("Your workflow has been imported successfully.");
    } catch (error) {
      toast.error("Failed to import workflow. Please check the file format.");
    }
  };
  reader.readAsText(file);
};
