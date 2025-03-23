
import { useCallback } from 'react';
import { Connection, Edge, addEdge } from '@xyflow/react';
import { useToast } from '@/hooks/use-toast';
import { addToHistory } from '@/utils/workflowHistory';

export function useFlowConnect(
  nodes: any[],
  edges: Edge[],
  nodeCounter: number,
  setEdges: (edges: Edge[] | ((eds: Edge[]) => Edge[])) => void,
  history: any,
  setHistory: (history: any) => void
) {
  const { toast } = useToast();
  
  return useCallback(
    (params: Connection) => {
      setEdges((eds) => {
        const newEdges = addEdge(params, eds);
        const newState = { nodes, edges: newEdges, nodeCounter };
        setHistory(addToHistory(history, newState));
        return newEdges;
      });
      toast({
        title: "Connection Added",
        description: "The nodes have been successfully connected."
      });
    },
    [setEdges, nodes, nodeCounter, history, setHistory, toast]
  );
}
