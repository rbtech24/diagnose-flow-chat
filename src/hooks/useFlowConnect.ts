
import { useCallback } from 'react';
import { Connection, Edge, addEdge } from '@xyflow/react';
import toast from 'react-hot-toast';
import { addToHistory } from '@/utils/workflowHistory';

export function useFlowConnect(
  nodes: any[],
  edges: Edge[],
  nodeCounter: number,
  setEdges: (edges: Edge[] | ((eds: Edge[]) => Edge[])) => void,
  history: any,
  setHistory: (history: any) => void
) {
  return useCallback(
    (params: Connection) => {
      setEdges((eds) => {
        const newEdges = addEdge(params, eds);
        const newState = { nodes, edges: newEdges, nodeCounter };
        setHistory(addToHistory(history, newState));
        return newEdges;
      });
      toast.success("The nodes have been successfully connected.");
    },
    [setEdges, nodes, nodeCounter, history, setHistory]
  );
}
