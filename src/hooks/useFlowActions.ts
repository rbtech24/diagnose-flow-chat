
import { useCallback } from 'react';
import { Connection, Node, Edge, useReactFlow, addEdge } from '@xyflow/react';
import { toast } from './use-toast';
import { addToHistory } from '@/utils/workflowHistory';
import { handleQuickSave } from '@/utils/flow';
import { SavedWorkflow } from '@/utils/flow/types';
import { useNodeDeletion } from './useNodeDeletion';

export function useFlowActions(
  nodes: Node[],
  edges: Edge[],
  nodeCounter: number,
  setNodes: (nodes: Node[] | ((nds: Node[]) => Node[])) => void,
  setEdges: (edges: Edge[] | ((eds: Edge[]) => Edge[])) => void,
  setNodeCounter: (nc: number | ((nc: number) => number)) => void,
  history: any,
  setHistory: (history: any) => void,
  copiedNodes: Node[],
  setCopiedNodes: (nodes: Node[]) => void,
  currentWorkflow?: SavedWorkflow
) {
  const { getViewport } = useReactFlow();

  const { handleDeleteSelected } = useNodeDeletion(
    nodes,
    edges,
    nodeCounter,
    setNodes,
    setEdges,
    setHistory,
    history
  );

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
  }, [nodes, setCopiedNodes]);

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

  const handleQuickSaveClick = useCallback(async () => {
    if (!currentWorkflow) {
      toast({
        title: "Cannot Quick Save",
        description: "This is a new workflow. Please use 'Save Workflow' to save it first.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      await handleQuickSave(nodes, edges, nodeCounter, currentWorkflow);
      toast({
        title: "Workflow Saved",
        description: "Your changes have been saved successfully."
      });
    } catch (error) {
      toast({
        title: "Save Failed",
        description: "There was an error saving your workflow. Please try using the Save button.",
        variant: "destructive"
      });
    }
  }, [nodes, edges, nodeCounter, currentWorkflow]);

  const handleAddNode = useCallback(() => {
    const viewport = getViewport();
    
    // Calculate center of current viewport with zoom taken into account
    const centerX = (-viewport.x + window.innerWidth / 2) / viewport.zoom;
    const centerY = (-viewport.y + window.innerHeight / 2) / viewport.zoom;
    
    const newNodeId = `node-${nodeCounter}`;
    const newNode = {
      id: newNodeId,
      type: 'diagnosis',
      position: {
        x: centerX - 150, // Offset to center the node (node width is ~300px)
        y: centerY - 75,  // Offset to center the node (node height is ~150px)
      },
      data: {
        label: `Step ${nodeCounter}`,
        type: 'question',
        nodeId: `N${String(nodeCounter).padStart(3, '0')}`,
        content: 'Enter your instructions here',
        options: ['Yes', 'No'],
        media: [],
        technicalSpecs: {
          range: { min: 0, max: 0 },
          testPoints: '',
          value: 0,
          measurementPoints: '',
          points: ''
        }
      },
    };

    setNodes((nds) => [...nds, newNode]);
    setNodeCounter((nc) => nc + 1);
    
    const newState = { nodes: [...nodes, newNode], edges, nodeCounter: nodeCounter + 1 };
    setHistory(addToHistory(history, newState));

    toast({
      title: "Step Added",
      description: "New step has been added to the center of your current view."
    });
  }, [nodes, edges, nodeCounter, setNodes, setNodeCounter, setHistory, history, getViewport]);

  return {
    handleConnect,
    handleCopySelected,
    handlePaste,
    handleDeleteSelected,
    handleQuickSaveClick,
    handleAddNode,
  };
}
