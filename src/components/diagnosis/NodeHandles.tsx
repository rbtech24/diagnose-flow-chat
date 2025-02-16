
import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { getHandleStyle } from '@/utils/handleUtils';

interface NodeHandlesProps {
  connected: {
    top: { isConnected: boolean; isNoOutcome: boolean };
    right: { isConnected: boolean; isNoOutcome: boolean };
    bottom: { isConnected: boolean; isNoOutcome: boolean };
    left: { isConnected: boolean; isNoOutcome: boolean };
  };
  handleDisconnect: (handleId: string) => void;
}

export function NodeHandles({ connected, handleDisconnect }: NodeHandlesProps) {
  return (
    <>
      <Handle 
        type="source" 
        position={Position.Top} 
        id="top"
        style={{...getHandleStyle(connected.top), left: 'calc(50% - 12px)'}}
        onClick={() => connected.top.isConnected && handleDisconnect('top')}
      />
      <Handle 
        type="target" 
        position={Position.Top} 
        id="top"
        style={{...getHandleStyle(connected.top), left: 'calc(50% + 12px)'}}
        onClick={() => connected.top.isConnected && handleDisconnect('top')}
      />
      
      <Handle
        type="source"
        position={Position.Left}
        id="left"
        style={{...getHandleStyle(connected.left), top: 'calc(50% - 12px)'}}
        onClick={() => connected.left.isConnected && handleDisconnect('left')}
      />
      <Handle
        type="target"
        position={Position.Left}
        id="left"
        style={{...getHandleStyle(connected.left), top: 'calc(50% + 12px)'}}
        onClick={() => connected.left.isConnected && handleDisconnect('left')}
      />

      <Handle
        type="source"
        position={Position.Right}
        id="right"
        style={{...getHandleStyle(connected.right), top: 'calc(50% - 12px)'}}
        onClick={() => connected.right.isConnected && handleDisconnect('right')}
      />
      <Handle
        type="target"
        position={Position.Right}
        id="right"
        style={{...getHandleStyle(connected.right), top: 'calc(50% + 12px)'}}
        onClick={() => connected.right.isConnected && handleDisconnect('right')}
      />

      <Handle 
        type="source" 
        position={Position.Bottom}
        id="bottom" 
        style={{...getHandleStyle(connected.bottom), left: 'calc(50% - 12px)'}}
        onClick={() => connected.bottom.isConnected && handleDisconnect('bottom')}
      />
      <Handle 
        type="target" 
        position={Position.Bottom}
        id="bottom" 
        style={{...getHandleStyle(connected.bottom), left: 'calc(50% + 12px)'}}
        onClick={() => connected.bottom.isConnected && handleDisconnect('bottom')}
      />
    </>
  );
}
