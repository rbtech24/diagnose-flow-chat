
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
      label: 'Start Diagnosis',
      type: 'question',
      content: 'Select the main symptom or issue you are experiencing.',
      options: ['No Power', 'Not Heating', 'Making Noise', 'Not Starting'],
      nodeId: 'START',
      media: [],
      technicalSpecs: {
        range: { min: 0, max: 0 },
        testPoints: '',
        value: 0,
        measurementPoints: '',
        points: ''
      }
    }
  },
];

export const initialEdges: Edge[] = [];
