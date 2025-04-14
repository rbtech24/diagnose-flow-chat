
import { useState, useCallback } from 'react';
import { Node, Edge, Connection, useNodesState, useEdgesState, addEdge } from '@xyflow/react';
import { toast } from '@/hooks/use-toast';
import { WorkflowState, HistoryState, addToHistory } from '@/utils/workflowHistory';

const LOCAL_STORAGE_KEY = 'workflow-state';

interface CheckWorkflowAccessParams {
  role?: string;
}

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

  // Add this function to check workflow access
  const checkWorkflowAccess = useCallback(({ role }: CheckWorkflowAccessParams) => {
    if (!role || (role !== 'admin' && role !== 'company')) {
      toast({
        title: "Access Denied",
        description: "You don't have permission to access this workflow editor.",
        type: "error",
        variant: "destructive"
      });
      return false;
    }
    return true;
  }, []);

  return {
    nodes,
    setNodes,
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
    checkWorkflowAccess,
  };
}
