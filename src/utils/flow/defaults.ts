
import { Node, Edge, MarkerType } from '@xyflow/react';

export const defaultEdgeOptions = {
  type: 'smoothstep',
  animated: true,
  markerEnd: {
    type: MarkerType.ArrowClosed,
    color: '#22c55e',
  },
  style: {
    strokeWidth: 2,
    stroke: '#22c55e',
  },
};

export const initialNodes: Node[] = [
  {
    id: 'start',
    type: 'diagnosis',
    position: { x: 250, y: 0 },
    data: { 
      label: 'Start Diagnosis [START]',
      type: 'symptom',
      content: 'Select the main symptom',
      options: ['Dryer No Heat', 'No Power', 'Loud Noise'],
      nodeId: 'START'
    }
  },
];

export const initialEdges: Edge[] = [];
