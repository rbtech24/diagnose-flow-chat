
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
      label: 'Start Diagnosis',
      title: 'Start Diagnosis',
      type: 'question',
      nodeId: 'N001',
      content: 'Click here to begin diagnosis workflow',
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
  },
  {
    id: 'step-1',
    type: 'diagnosis',
    position: { x: 250, y: 200 },
    data: {
      label: 'Check Power',
      title: 'Check Power Connection',
      type: 'test',
      nodeId: 'N002',
      content: 'Verify that the dryer is properly plugged in and receiving power',
      options: [],
      media: [],
      technicalSpecs: {
        range: { min: 0, max: 0 }
      }
    },
  }
];

export const initialEdges: Edge[] = [
  {
    id: 'e1-2',
    source: 'start-node',
    target: 'step-1',
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
  }
];
