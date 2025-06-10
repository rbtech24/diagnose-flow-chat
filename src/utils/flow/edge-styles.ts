
import { MarkerType } from '@xyflow/react';

export const getEdgeStyle = (edgeType?: string, isAnimated?: boolean) => {
  const baseStyle = {
    strokeWidth: 3,
    stroke: '#22c55e',
  };

  const animatedStyle = isAnimated ? {
    strokeDasharray: '5,5',
    animation: 'dash 1s linear infinite',
  } : {};

  switch (edgeType) {
    case 'success':
      return {
        ...baseStyle,
        stroke: '#22c55e',
        ...animatedStyle,
      };
    case 'error':
      return {
        ...baseStyle,
        stroke: '#ef4444',
        ...animatedStyle,
      };
    case 'warning':
      return {
        ...baseStyle,
        stroke: '#f59e0b',
        ...animatedStyle,
      };
    case 'workflow-link':
      return {
        ...baseStyle,
        stroke: '#8b5cf6',
        strokeDasharray: '10,5',
        ...animatedStyle,
      };
    default:
      return {
        ...baseStyle,
        ...animatedStyle,
      };
  }
};

export const getEdgeMarker = (edgeType?: string) => {
  const baseMarker = {
    type: MarkerType.ArrowClosed,
    width: 20,
    height: 20,
  };

  switch (edgeType) {
    case 'success':
      return {
        ...baseMarker,
        color: '#22c55e',
      };
    case 'error':
      return {
        ...baseMarker,
        color: '#ef4444',
      };
    case 'warning':
      return {
        ...baseMarker,
        color: '#f59e0b',
      };
    case 'workflow-link':
      return {
        ...baseMarker,
        color: '#8b5cf6',
      };
    default:
      return {
        ...baseMarker,
        color: '#22c55e',
      };
  }
};

export const enhancedEdgeOptions = {
  type: 'smoothstep',
  animated: false,
  markerEnd: getEdgeMarker(),
  style: getEdgeStyle(),
};
