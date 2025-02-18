
import React from 'react';
import { Position } from '@xyflow/react';
import { HandlePair } from './HandlePair';

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
      <div className="absolute top-0 left-1/2 -translate-x-1/2">
        <HandlePair
          position={Position.Top}
          connected={connected.top}
          handleDisconnect={handleDisconnect}
          orientation="horizontal"
        />
      </div>
      
      <div className="absolute left-0 top-1/2 -translate-y-1/2">
        <HandlePair
          position={Position.Left}
          connected={connected.left}
          handleDisconnect={handleDisconnect}
          orientation="vertical"
        />
      </div>

      <div className="absolute right-0 top-1/2 -translate-y-1/2">
        <HandlePair
          position={Position.Right}
          connected={connected.right}
          handleDisconnect={handleDisconnect}
          orientation="vertical"
        />
      </div>

      <div className="absolute bottom-0 left-1/2 -translate-x-1/2">
        <HandlePair
          position={Position.Bottom}
          connected={connected.bottom}
          handleDisconnect={handleDisconnect}
          orientation="horizontal"
        />
      </div>
    </>
  );
}
