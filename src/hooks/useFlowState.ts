import { useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Node, Edge, addEdge, OnNodesChange, OnEdgesChange, OnConnect, applyNodeChanges, applyEdgeChanges } from '@xyflow/react';

export function useFlowState() {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [nodeCounter, setNodeCounter] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [snapToGrid, setSnapToGrid] = useState<boolean>(true);
  const [copiedNodes, setCopiedNodes] = useState<Node[]>([]);
  const [searchParams] = useSearchParams();
  const { toast } = useToast();

  const onNodesChange: OnNodesChange = useCallback((changes) => {
    setNodes((nds) => applyNodeChanges(changes, nds));
  }, []);

  const onEdgesChange: OnEdgesChange = useCallback((changes) => {
    setEdges((eds) => applyEdgeChanges(changes, eds));
  }, []);

  const onConnect: OnConnect = useCallback(
    (connection) => {
      setEdges((eds) => addEdge(connection, eds));
      toast({
        title: "Connection created",
        description: "A new connection was created between nodes.",
        type: "success"
      });
    },
    [toast]
  );

  const checkWorkflowAccess = useCallback((role: string | undefined) => {
    // Define which roles have access to the workflow editor
    const allowedRoles = ['admin', 'company'];
    return role ? allowedRoles.includes(role) : false;
  }, []);

  const clearSavedState = useCallback(() => {
    setNodes([]);
    setEdges([]);
    setNodeCounter(1);
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
    copiedNodes,
    setCopiedNodes,
    onNodesChange,
    onEdgesChange,
    onConnect,
    checkWorkflowAccess,
    clearSavedState,
  };
}
