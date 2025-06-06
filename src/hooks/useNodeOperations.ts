
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
    // Create the updated nodes array directly instead of using a callback
    const updatedNodes = nodes.map(node => {
      if (node.id === nodeId) {
        return {
          ...node,
          data: {
            ...node.data,
            ...newData,
            nodeId: node.data.nodeId // Preserve the original nodeId
          }
        };
      }
      return node;
    });

    // Update nodes state
    setNodes(updatedNodes);

    // Add to history
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
