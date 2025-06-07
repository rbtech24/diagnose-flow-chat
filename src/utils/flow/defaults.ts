
import { Node, Edge, MarkerType } from '@xyflow/react';

export const defaultEdgeOptions = {
  type: 'smoothstep',
  animated: false,
  markerEnd: {
    type: MarkerType.ArrowClosed,
    color: '#22c55e',
    width: 20,
    height: 20,
  },
  style: {
    strokeWidth: 2,
    stroke: '#22c55e',
  },
};

export const initialNodes: Node[] = [
  {
    id: 'start-node',
    type: 'diagnosis',
    position: { x: 250, y: 50 },
    data: {
      label: 'Start',
      type: 'start',
      nodeId: 'N001',
      content: 'Click here to begin diagnosis',
      options: [],
      media: [],
      technicalSpecs: {
        range: { min: 0, max: 0 },
        testPoints: '',
        value: 0,
        measurementPoints: '',
        points: ''
      }
    },
  }
];

export const initialEdges: Edge[] = [];
