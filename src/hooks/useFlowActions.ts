
import { useCallback } from 'react';
import { Connection, Node, Edge, useReactFlow } from '@xyflow/react';
import { toast } from './use-toast';
import { addToHistory } from '@/utils/workflowHistory';
import { handleQuickSave } from '@/utils/flow';
import { SavedWorkflow } from '@/utils/flow/types';

export function useFlowActions(
  nodes: Node[],
  edges: Edge[],
  nodeCounter: number,
  setNodes: (nodes: Node[] | ((nds: Node[]) => Node[])) => void,
  setEdges: (edges: Edge[] | ((eds: Edge[]) => Edge[])) => void,
  setNodeCounter: (nc: number | ((nc: number) => number)) => void,
  history: any,
  setHistory: (history: any) => void,
  currentWorkflow?: SavedWorkflow
) {
  const { getViewport } = useReactFlow();

  const handleConnect = useCallback(
    (params: Connection) => {
      setEdges((eds) => {
        const newEdges = addEdge(params, eds);
        const newState = { nodes, edges: newEdges, nodeCounter };
        setHistory(addToHistory(history, newState));
        return newEdges;
      });
      toast({
        title: "Connection Added",
        description: "Nodes have been connected successfully."
      });
    },
    [setEdges, nodes, nodeCounter, history, setHistory]
  );

  const handleCopySelected = useCallback(() => {
    const selectedNodes = nodes.filter(node => node.selected);
    if (selectedNodes.length > 0) {
      setCopiedNodes(selectedNodes);
      toast({
        title: "Nodes Copied",
        description: `${selectedNodes.length} node(s) copied to clipboard`
      });
    }
  }, [nodes]);

  const handlePaste = useCallback(() => {
    if (copiedNodes.length === 0) return;

    const viewport = getViewport();
    const [minX, minY] = [
      Math.min(...copiedNodes.map(node => node.position.x)),
      Math.min(...copiedNodes.map(node => node.position.y))
    ];

    const newNodes = copiedNodes.map(node => ({
      ...node,
      id: `${node.id}-copy-${Date.now()}`,
      position: {
        x: -viewport.x + window.innerWidth / 2 + (node.position.x - minX),
        y: -viewport.y + window.innerHeight / 2 + (node.position.y - minY),
      },
      data: {
        ...node.data,
        label: `${node.data.label} (Copy)`,
        nodeId: `N${String(nodeCounter + 1).padStart(3, '0')}`
      },
      selected: false
    }));

    setNodes(prevNodes => {
      const updatedNodes = [...prevNodes, ...newNodes];
      const newState = { nodes: updatedNodes, edges, nodeCounter: nodeCounter + newNodes.length };
      setHistory(addToHistory(history, newState));
      return updatedNodes;
    });

    setNodeCounter(prev => prev + newNodes.length);

    toast({
      title: "Nodes Pasted",
      description: `${newNodes.length} node(s) pasted`
    });
  }, [copiedNodes, getViewport, edges, nodeCounter, history, setNodes, setNodeCounter, setHistory]);

  const handleQuickSaveClick = useCallback(() => {
    if (currentWorkflow) {
      handleQuickSave(nodes, edges, nodeCounter, currentWorkflow);
      toast({
        title: "Workflow Auto-saved",
        description: "Your changes have been saved automatically."
      });
    } else {
      toast({
        title: "Cannot Quick Save",
        description: "This is a new workflow. Please use 'Save Workflow' to save it first.",
        variant: "destructive"
      });
    }
  }, [nodes, edges, nodeCounter, currentWorkflow]);

  return {
    handleConnect,
    handleCopySelected,
    handlePaste,
    handleQuickSaveClick,
  };
}
