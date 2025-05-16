
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
      const workflow = JSON.parse(e.target?.result as string);
      console.log('Imported workflow data:', workflow);
      
      // Check if the imported data has nodes and edges
      if (!workflow.nodes || !Array.isArray(workflow.nodes) || !workflow.edges || !Array.isArray(workflow.edges)) {
        throw new Error('Invalid workflow format: missing nodes or edges');
      }

      // Convert any imported nodes to the correct format if needed
      const processedNodes = workflow.nodes.map((node: any) => {
        console.log('Processing node:', node);
        
        // Preserve all original node data
        const processedNode = {
          ...node,
          // Make sure the node type is preserved exactly as in the original
          type: node.type || 'diagnosis',
          // Ensure position exists
          position: node.position || { x: 0, y: 0 },
          // Ensure all data properties are preserved
          data: {
            ...node.data,
            // Only add nodeId if it doesn't exist
            nodeId: node.data?.nodeId || `N${String(Math.random().toString(36).substr(2, 5))}`,
          }
        };

        // Handle flowTitle, flowNode, flowAnswer specific properties
        // These might have different field names or structures
        if (node.type === 'flowTitle') {
          processedNode.data = {
            ...processedNode.data,
            label: processedNode.data.title || 'Title',
            title: processedNode.data.title || 'Title'
          };
        } 
        else if (node.type === 'flowNode' || node.type === 'flowAnswer') {
          processedNode.data = {
            ...processedNode.data,
            label: processedNode.data.title || 'Node',
            content: processedNode.data.richInfo || processedNode.data.content || ''
          };
        }

        console.log('Processed node:', processedNode);
        return processedNode;
      });

      // Process edges to ensure they have all required properties
      const processedEdges = workflow.edges.map((edge: any) => {
        console.log('Processing edge:', edge);
        
        return {
          ...edge,
          // Add any required properties for edges here
          type: edge.type || 'smoothstep',
          // Ensure source and target exist
          source: edge.source,
          target: edge.target,
          // Preserve sourceHandle and targetHandle if they exist
          sourceHandle: edge.sourceHandle || null,
          targetHandle: edge.targetHandle || null
        };
      });

      setNodes(processedNodes);
      setEdges(processedEdges);
      
      // Determine a proper nodeCounter value - use the highest number found in node IDs plus one
      let maxNodeId = 0;
      processedNodes.forEach(node => {
        if (node.id) {
          // Try to extract a number from the node ID if it follows a pattern like 'node-5'
          const match = node.id.match(/\d+$/);
          if (match) {
            const idNum = parseInt(match[0], 10);
            if (!isNaN(idNum) && idNum > maxNodeId) {
              maxNodeId = idNum;
            }
          }
        }
      });
      
      const nodeCounter = workflow.nodeCounter || Math.max(maxNodeId + 1, processedNodes.length + 1);
      setNodeCounter(nodeCounter);
      
      toast({
        title: "Workflow Imported",
        description: `Successfully imported workflow with ${processedNodes.length} nodes and ${processedEdges.length} edges.`
      });
      
      console.log('Import complete:', { 
        nodes: processedNodes.length, 
        edges: processedEdges.length, 
        nodeCounter
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
