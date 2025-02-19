
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

    const updatedNode = {
      ...nodeToUpdate,
      data: {
        ...nodeToUpdate.data,
        label: newData.label,
        type: newData.type,
        content: newData.content,
        options: newData.options,
        media: newData.media,
        technicalSpecs: newData.technicalSpecs,
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
