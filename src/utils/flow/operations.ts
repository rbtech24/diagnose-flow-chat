
import { Node, Edge } from '@xyflow/react';
import { toast } from '@/hooks/use-toast';
import { SavedWorkflow } from './types';
import { getAllWorkflows } from './storage';

export const handleQuickSave = (
  nodes: Node[],
  edges: Edge[],
  nodeCounter: number,
  currentWorkflow: SavedWorkflow
) => {
  if (!currentWorkflow?.metadata?.folder || !currentWorkflow?.metadata?.name) {
    toast({
      title: "Error",
      description: "No folder information available for quick save",
      variant: "destructive"
    });
    return;
  }

  handleSaveWorkflow(
    nodes,
    edges,
    nodeCounter,
    currentWorkflow.metadata.name,
    currentWorkflow.metadata.folder,
    currentWorkflow.metadata.appliance,
    currentWorkflow.metadata.symptom
  );
};

export const handleSaveWorkflow = (
  nodes: Node[], 
  edges: Edge[], 
  nodeCounter: number,
  name: string,
  folder: string,
  appliance?: string,
  symptom?: string
) => {
  console.log('Saving workflow:', { name, folder, nodeCount: nodes.length });
  
  if (!name || !folder) {
    toast({
      title: "Error",
      description: "Workflow name and folder are required",
      variant: "destructive"
    });
    return;
  }

  try {
    const workflows = getAllWorkflows();
    
    const newWorkflow = {
      metadata: {
        name,
        folder,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        appliance,
        symptom,
        isActive: true // Set default state to active
      },
      nodes,
      edges,
      nodeCounter
    };

    const existingIndex = workflows.findIndex(
      w => w.metadata.name === name && w.metadata.folder === folder
    );

    if (existingIndex >= 0) {
      workflows[existingIndex] = {
        ...newWorkflow,
        metadata: {
          ...newWorkflow.metadata,
          createdAt: workflows[existingIndex].metadata.createdAt,
          isActive: workflows[existingIndex].metadata.isActive // Preserve active state
        }
      };
      console.log('Updated existing workflow at index:', existingIndex);
    } else {
      workflows.push(newWorkflow);
      console.log('Added new workflow, total workflows:', workflows.length);
    }

    localStorage.setItem('diagnostic-workflows', JSON.stringify(workflows));
    
    toast({
      title: "Workflow Saved",
      description: `${name} has been saved to ${folder}.`
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
