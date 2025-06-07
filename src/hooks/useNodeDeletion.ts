
import { useCallback } from 'react';
import { Node, Edge } from '@xyflow/react';
import { toast } from '@/hooks/use-toast';
import { addToHistory } from '@/utils/workflowHistory';

export function useNodeDeletion(
  nodes: Node[],
  edges: Edge[],
  nodeCounter: number,
  setNodes: (nodes: Node[] | ((nds: Node[]) => Node[])) => void,
  setEdges: (edges: Edge[] | ((eds: Edge[]) => Edge[])) => void,
  setHistory: (history: any) => void,
  history: any
) {
  const handleDeleteSelected = useCallback(() => {
    const selectedNodes = nodes.filter(node => node.selected);
    const selectedEdges = edges.filter(edge => edge.selected);
    
    if (selectedNodes.length === 0 && selectedEdges.length === 0) {
      toast({
        title: "Nothing to Delete",
        description: "Please select nodes or edges to delete"
      });
      return;
    }

    const selectedNodeIds = selectedNodes.map(node => node.id);
    
    // Remove selected nodes and their connected edges
    const newNodes = nodes.filter(node => !selectedNodeIds.includes(node.id));
    const newEdges = edges.filter(edge => 
      !selectedEdges.map(e => e.id).includes(edge.id) &&
      !selectedNodeIds.includes(edge.source) && 
      !selectedNodeIds.includes(edge.target)
    );

    setNodes(newNodes);
    setEdges(newEdges);

    // Add to history
    const newState = { nodes: newNodes, edges: newEdges, nodeCounter };
    setHistory(addToHistory(history, newState));

    toast({
      title: "Deleted Successfully",
      description: `Removed ${selectedNodes.length} node(s) and ${selectedEdges.length + (edges.length - newEdges.length - selectedEdges.length)} edge(s)`
    });
  }, [nodes, edges, nodeCounter, setNodes, setEdges, setHistory, history]);

  return { handleDeleteSelected };
}
