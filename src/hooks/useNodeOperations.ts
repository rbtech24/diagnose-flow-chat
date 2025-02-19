
import { useCallback } from 'react';
import { Node } from '@xyflow/react';
import { toast } from '@/hooks/use-toast';
import { addToHistory } from '@/utils/workflowHistory';

export function useNodeOperations(
  nodes: Node[],
  edges: any[],
  nodeCounter: number,
  setNodes: (nodes: Node[]) => void,
  setHistory: (history: any) => void,
) {
  const handleNodeUpdate = useCallback((nodeId: string, newData: any) => {
    console.log('handleNodeUpdate called with:', { nodeId, newData, currentNodes: nodes });
    
    const nodeToUpdate = nodes.find(node => node.id === nodeId);
    if (!nodeToUpdate) {
      console.error('Node not found:', nodeId);
      return;
    }

    // Preserve the original nodeId and add new data
    const updatedNode = {
      ...nodeToUpdate,
      data: {
        nodeId: nodeToUpdate.data.nodeId, // Preserve the original nodeId
        label: newData.label || nodeToUpdate.data.label,
        type: newData.type || nodeToUpdate.data.type,
        content: newData.content || nodeToUpdate.data.content,
        options: Array.isArray(newData.options) ? newData.options : nodeToUpdate.data.options,
        media: Array.isArray(newData.media) ? newData.media : nodeToUpdate.data.media || [],
        technicalSpecs: newData.technicalSpecs || nodeToUpdate.data.technicalSpecs,
      }
    };

    console.log('Updated node data:', updatedNode);

    const updatedNodes = nodes.map(node => 
      node.id === nodeId ? updatedNode : node
    );

    setNodes(updatedNodes);

    const newState = { 
      nodes: updatedNodes, 
      edges, 
      nodeCounter 
    };
    setHistory(prevHistory => addToHistory(prevHistory, newState));

    toast({
      title: "Node Updated",
      description: "Changes have been applied successfully."
    });
  }, [nodes, edges, nodeCounter, setNodes, setHistory]);

  return { handleNodeUpdate };
}
