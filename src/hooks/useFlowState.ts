
import { useState, useCallback } from 'react';
import { Node, Edge, Connection, useNodesState, useEdgesState } from '@xyflow/react';
import { toast } from '@/hooks/use-toast';
import { WorkflowState, HistoryState, addToHistory } from '@/utils/workflowHistory';

const LOCAL_STORAGE_KEY = 'workflow-state';

export function useFlowState() {
  const loadInitialState = (): WorkflowState => {
    const savedState = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (savedState) {
      try {
        return JSON.parse(savedState);
      } catch (e) {
        console.error('Failed to parse saved workflow state');
      }
    }
    return { nodes: [], edges: [], nodeCounter: 1 };
  };

  const [nodes, setNodes, onNodesChange] = useNodesState(loadInitialState().nodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(loadInitialState().edges);
  const [nodeCounter, setNodeCounter] = useState(loadInitialState().nodeCounter);
  const [isLoading, setIsLoading] = useState(false);
  const [snapToGrid, setSnapToGrid] = useState(true);
  const [copiedNodes, setCopiedNodes] = useState<Node[]>([]);

  // Clear local storage when resetting the state
  const clearSavedState = useCallback(() => {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
  }, []);

  // Enhanced setNodes function that validates and logs node data
  const setNodesEnhanced = useCallback((newNodes: Node[] | ((nds: Node[]) => Node[])) => {
    if (typeof newNodes === 'function') {
      setNodes((prevNodes) => {
        const result = newNodes(prevNodes);
        console.log('Setting nodes with function:', result);
        return result;
      });
    } else {
      console.log('Setting nodes with array:', newNodes);
      setNodes(newNodes);
    }
  }, [setNodes]);

  return {
    nodes,
    setNodes: setNodesEnhanced,
    edges,
    setEdges,
    nodeCounter,
    setNodeCounter,
    isLoading,
    setIsLoading,
    snapToGrid,
    setSnapToGrid,
    copiedNodes,
    setCopiedNodes,
    clearSavedState,
    onNodesChange,
    onEdgesChange,
  };
}
