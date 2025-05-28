
import React from 'react';
import { HandleWithTooltip } from './HandleWithTooltip';
import { Position } from '@xyflow/react';

interface ConnectedState {
  top: { isConnected: boolean; isNoOutcome: boolean };
  right: { isConnected: boolean; isNoOutcome: boolean };
  bottom: { isConnected: boolean; isNoOutcome: boolean };
  left: { isConnected: boolean; isNoOutcome: boolean };
}

interface NodeHandlesProps {
  connected: ConnectedState;
  handleDisconnect: (handleId: string) => void;
}

export function NodeHandles({ connected, handleDisconnect }: NodeHandlesProps) {
  return (
    <>
      <HandleWithTooltip
        type="source"
        position={Position.Right}
        id="right"
        connected={connected.right}
        handleDisconnect={handleDisconnect}
        tooltipPosition="right"
      />
      <HandleWithTooltip
        type="source"
        position={Position.Bottom}
        id="bottom"
        connected={connected.bottom}
        handleDisconnect={handleDisconnect}
        tooltipPosition="bottom"
      />
      <HandleWithTooltip
        type="source"
        position={Position.Left}
        id="left"
        connected={connected.left}
        handleDisconnect={handleDisconnect}
        tooltipPosition="left"
      />
    </>
  );
}
