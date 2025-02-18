
import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { getHandleStyle } from '@/utils/handleUtils';
import { ArrowDown, ArrowUp } from 'lucide-react';

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
      <div className="absolute top-0 left-1/2 -translate-x-1/2 flex items-center gap-1">
        <div className="relative group">
          <Handle 
            type="target" 
            position={Position.Top} 
            id="top"
            style={{
              ...getHandleStyle(connected.top),
              left: '-12px',
              backgroundColor: '#e2e8f0',
              border: '2px solid #94a3b8'
            }}
            onClick={() => connected.top.isConnected && handleDisconnect('top')}
          />
          <div className="absolute -top-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-xs bg-gray-800 text-white px-2 py-1 rounded">
            Incoming
          </div>
          <ArrowDown className="w-3 h-3 text-gray-400 absolute -top-4" />
        </div>
        <div className="relative group">
          <Handle 
            type="source" 
            position={Position.Top} 
            id="top"
            style={{
              ...getHandleStyle(connected.top),
              left: '12px',
              backgroundColor: '#f1f5f9',
              border: '2px solid #64748b'
            }}
            onClick={() => connected.top.isConnected && handleDisconnect('top')}
          />
          <div className="absolute -top-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-xs bg-gray-800 text-white px-2 py-1 rounded">
            Outgoing
          </div>
          <ArrowUp className="w-3 h-3 text-gray-600 absolute -top-4" />
        </div>
      </div>
      
      <div className="absolute left-0 top-1/2 -translate-y-1/2 flex flex-col items-center gap-1">
        <div className="relative group">
          <Handle
            type="target"
            position={Position.Left}
            id="left"
            style={{
              ...getHandleStyle(connected.left),
              top: '-12px',
              backgroundColor: '#e2e8f0',
              border: '2px solid #94a3b8'
            }}
            onClick={() => connected.left.isConnected && handleDisconnect('left')}
          />
          <div className="absolute -left-20 opacity-0 group-hover:opacity-100 transition-opacity text-xs bg-gray-800 text-white px-2 py-1 rounded">
            Incoming
          </div>
        </div>
        <div className="relative group">
          <Handle
            type="source"
            position={Position.Left}
            id="left"
            style={{
              ...getHandleStyle(connected.left),
              top: '12px',
              backgroundColor: '#f1f5f9',
              border: '2px solid #64748b'
            }}
            onClick={() => connected.left.isConnected && handleDisconnect('left')}
          />
          <div className="absolute -left-20 opacity-0 group-hover:opacity-100 transition-opacity text-xs bg-gray-800 text-white px-2 py-1 rounded">
            Outgoing
          </div>
        </div>
      </div>

      <div className="absolute right-0 top-1/2 -translate-y-1/2 flex flex-col items-center gap-1">
        <div className="relative group">
          <Handle
            type="target"
            position={Position.Right}
            id="right"
            style={{
              ...getHandleStyle(connected.right),
              top: '-12px',
              backgroundColor: '#e2e8f0',
              border: '2px solid #94a3b8'
            }}
            onClick={() => connected.right.isConnected && handleDisconnect('right')}
          />
          <div className="absolute -right-20 opacity-0 group-hover:opacity-100 transition-opacity text-xs bg-gray-800 text-white px-2 py-1 rounded">
            Incoming
          </div>
        </div>
        <div className="relative group">
          <Handle
            type="source"
            position={Position.Right}
            id="right"
            style={{
              ...getHandleStyle(connected.right),
              top: '12px',
              backgroundColor: '#f1f5f9',
              border: '2px solid #64748b'
            }}
            onClick={() => connected.right.isConnected && handleDisconnect('right')}
          />
          <div className="absolute -right-20 opacity-0 group-hover:opacity-100 transition-opacity text-xs bg-gray-800 text-white px-2 py-1 rounded">
            Outgoing
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex items-center gap-1">
        <div className="relative group">
          <Handle 
            type="target" 
            position={Position.Bottom}
            id="bottom" 
            style={{
              ...getHandleStyle(connected.bottom),
              left: '-12px',
              backgroundColor: '#e2e8f0',
              border: '2px solid #94a3b8'
            }}
            onClick={() => connected.bottom.isConnected && handleDisconnect('bottom')}
          />
          <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-xs bg-gray-800 text-white px-2 py-1 rounded">
            Incoming
          </div>
          <ArrowUp className="w-3 h-3 text-gray-400 absolute -bottom-4" />
        </div>
        <div className="relative group">
          <Handle 
            type="source" 
            position={Position.Bottom}
            id="bottom" 
            style={{
              ...getHandleStyle(connected.bottom),
              left: '12px',
              backgroundColor: '#f1f5f9',
              border: '2px solid #64748b'
            }}
            onClick={() => connected.bottom.isConnected && handleDisconnect('bottom')}
          />
          <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-xs bg-gray-800 text-white px-2 py-1 rounded">
            Outgoing
          </div>
          <ArrowDown className="w-3 h-3 text-gray-600 absolute -bottom-4" />
        </div>
      </div>
    </>
  );
}
