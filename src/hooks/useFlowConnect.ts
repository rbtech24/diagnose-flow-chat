
import { useCallback } from 'react';
import { Connection, Edge, addEdge } from '@xyflow/react';
import { toast } from './use-toast';
import { addToHistory } from '@/utils/workflowHistory';
import { getEdgeStyle, getEdgeMarker } from '@/utils/flow/edge-styles';

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
        // Check if source node has workflow link field
        const sourceNode = nodes.find(n => n.id === params.source);
        let edgeType = 'default';
        let isAnimated = false;
        
        if (sourceNode?.data?.fields) {
          const workflowLinkField = sourceNode.data.fields.find(
            (field: any) => field.type === 'workflow-link' && field.content
          );
          
          if (workflowLinkField) {
            edgeType = 'workflow-link';
            isAnimated = true;
          }
        }

        const newEdge = {
          ...params,
          id: `edge-${params.source}-${params.target}`,
          type: 'smoothstep',
          animated: isAnimated,
          className: edgeType,
          style: getEdgeStyle(edgeType, isAnimated),
          markerEnd: getEdgeMarker(edgeType),
          data: { type: edgeType }
        };

        const newEdges = addEdge(newEdge, eds);
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
}
