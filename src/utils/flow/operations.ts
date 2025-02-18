
import { Node, Edge } from '@xyflow/react';
import { toast } from '@/hooks/use-toast';
import { SavedWorkflow } from './types';
import { getAllWorkflows, saveWorkflowToStorage } from './storage';

export const handleQuickSave = async (
  nodes: Node[],
  edges: Edge[],
  nodeCounter: number,
  currentWorkflow: SavedWorkflow
) => {
  if (!currentWorkflow?.metadata?.appliance) {
    toast({
      title: "Error",
      description: "No appliance selected for quick save",
      variant: "destructive"
    });
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
    toast({
      title: "Error",
      description: "Workflow name and appliance are required",
      variant: "destructive"
    });
    return null;
  }

  try {
    const existingWorkflows = await getAllWorkflows();
    
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
      w => w.metadata.name === name && w.metadata.appliance === appliance
    );

    if (existingIndex >= 0) {
      const updatedWorkflows = [...existingWorkflows];
      updatedWorkflows[existingIndex] = {
        ...newWorkflow,
        metadata: {
          ...newWorkflow.metadata,
          createdAt: existingWorkflows[existingIndex].metadata.createdAt,
          isActive: existingWorkflows[existingIndex].metadata.isActive
        }
      };
      await saveWorkflowToStorage(updatedWorkflows[existingIndex]);
    } else {
      await saveWorkflowToStorage(newWorkflow);
    }
    
    toast({
      title: "Workflow Saved",
      description: `${name} has been saved to ${appliance} workflows.`
    });
    
    return newWorkflow;
  } catch (error) {
    console.error('Error saving workflow:', error);
    toast({
      title: "Error",
      description: "Failed to save workflow. Please try again.",
      variant: "destructive"
    });
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
      toast({
        title: "Workflow Imported",
        description: "Your workflow has been imported successfully."
      });
    } catch (error) {
      toast({
        title: "Import Error",
        description: "Failed to import workflow. Please check the file format.",
        variant: "destructive"
      });
    }
  };
  reader.readAsText(file);
};
