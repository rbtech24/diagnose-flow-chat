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
  if (!currentWorkflow?.metadata?.appliance && !currentWorkflow?.metadata?.folder) {
    toast({
      title: "Error",
      description: "No appliance selected for quick save",
      variant: "destructive"
    });
    return;
  }

  try {
    const folder = currentWorkflow.metadata.folder || currentWorkflow.metadata.appliance;
    const appliance = currentWorkflow.metadata.appliance || currentWorkflow.metadata.folder;
    
    console.log("Quick saving workflow with existing data:", {
      name: currentWorkflow.metadata.name,
      folder,
      appliance,
      nodes: nodes.length
    });
    
    return handleSaveWorkflow(
      nodes,
      edges,
      nodeCounter,
      currentWorkflow.metadata.name,
      folder,
      appliance
    );
  } catch (error) {
    console.error("Error during quick save:", error);
    toast({
      title: "Error",
      description: "Failed to quick save workflow",
      variant: "destructive"
    });
  }
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
    console.error('Missing required fields for save:', { name, appliance });
    toast({
      title: "Error",
      description: "Workflow name and appliance are required",
      variant: "destructive"
    });
    return null;
  }

  try {
    console.log('Saving workflow:', { name, folder, appliance, nodeCounter, nodes: nodes.length, edges: edges.length });
    
    // Process nodes to ensure all media items have proper URLs
    const processedNodes = nodes.map(node => {
      // Make a deep copy of node to avoid modifying the original
      const processedNode = JSON.parse(JSON.stringify(node));
      
      // If node has media items, ensure they are properly formatted and preserved
      if (processedNode.data && processedNode.data.media && Array.isArray(processedNode.data.media)) {
        console.log(`Node ${node.id} has ${processedNode.data.media.length} media items`, processedNode.data.media);
        
        // Ensure each media item has the correct format
        processedNode.data.media = processedNode.data.media.map((item: any) => {
          // Make sure each item has the required properties
          if (!item || typeof item !== 'object') {
            console.warn(`Invalid media item found in node ${node.id}:`, item);
            return null;
          }
          
          return {
            type: item.type || 'image', // Default to image if type is missing
            url: item.url // Keep the URL as is
          };
        }).filter(Boolean); // Remove any null items
      }
      
      return processedNode;
    });
    
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
      nodes: processedNodes,
      edges,
      nodeCounter
    };

    // Find existing workflow by name and appliance/folder
    const existingIndex = existingWorkflows.findIndex(
      (w: SavedWorkflow) => 
      w.metadata.name === name && 
      (w.metadata.folder === folder || w.metadata.appliance === folder)
    );

    let workflowToSave: SavedWorkflow;
    
    if (existingIndex >= 0) {
      console.log('Updating existing workflow at index:', existingIndex);
      const updatedWorkflows = [...existingWorkflows];
      workflowToSave = {
        ...newWorkflow,
        metadata: {
          ...newWorkflow.metadata,
          createdAt: existingWorkflows[existingIndex].metadata.createdAt,
          isActive: existingWorkflows[existingIndex].metadata.isActive !== false
        }
      };
      updatedWorkflows[existingIndex] = workflowToSave;
      localStorage.setItem('diagnostic-workflows', JSON.stringify(updatedWorkflows));
    } else {
      console.log('Creating new workflow');
      workflowToSave = newWorkflow;
      existingWorkflows.push(workflowToSave);
      localStorage.setItem('diagnostic-workflows', JSON.stringify(existingWorkflows));
    }
    
    // Try to save to Supabase as well
    try {
      await saveWorkflowToStorage(workflowToSave);
    } catch (error) {
      console.error('Error saving to Supabase, but workflow saved to localStorage:', error);
      // Don't rethrow this error as we've already saved to localStorage
    }
    
    // Dispatch a storage event to notify other components
    window.dispatchEvent(new StorageEvent('storage', {
      key: 'diagnostic-workflows',
      newValue: localStorage.getItem('diagnostic-workflows')
    }));
    
    toast({
      title: "Workflow Saved",
      description: `${name} has been saved to ${appliance} workflows.`
    });
    
    return workflowToSave;
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
      const workflow: SavedWorkflow = JSON.parse(e.target?.result as string);
      console.log('Imported workflow data:', workflow);
      
      if (!workflow.nodes || !Array.isArray(workflow.nodes) || !workflow.edges || !Array.isArray(workflow.edges)) {
        throw new Error('Invalid workflow format: missing nodes or edges');
      }

      setNodes(workflow.nodes);
      setEdges(workflow.edges);
      setNodeCounter(workflow.nodeCounter || workflow.nodes.length + 1);
      
      toast({
        title: "Workflow Imported",
        description: `Successfully imported workflow with ${workflow.nodes.length} nodes and ${workflow.edges.length} edges.`
      });
      
    } catch (error) {
      console.error('Error importing workflow:', error);
      toast({
        title: "Import Error",
        description: "Failed to import workflow. Please check the file format.",
        variant: "destructive"
      });
    }
  };
  reader.readAsText(file);
};
