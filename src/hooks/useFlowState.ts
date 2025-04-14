
import { useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Node, Edge, addEdge, OnNodesChange, OnEdgesChange, OnConnect, applyNodeChanges, applyEdgeChanges } from '@xyflow/react';

export function useFlowState() {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
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
        variant: "default",
      });
    },
    [toast]
  );

  const checkWorkflowAccess = useCallback((role: string | undefined) => {
    // Define which roles have access to the workflow editor
    const allowedRoles = ['admin', 'company'];
    return role ? allowedRoles.includes(role) : false;
  }, []);

  return {
    nodes,
    setNodes,
    edges,
    setEdges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    checkWorkflowAccess,
  };
}
