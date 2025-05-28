
import React from 'react';
import { Handle, Position, HandleType } from '@xyflow/react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { LucideIcon } from 'lucide-react';

interface HandleWithTooltipProps {
  type: HandleType;
  position: Position;
  id: string;
  connected: { isConnected: boolean; isNoOutcome: boolean };
  handleDisconnect: (handleId: string) => void;
  tooltipPosition: string;
  style?: React.CSSProperties;
  iconPosition?: string;
}

export function HandleWithTooltip({
  type,
  position,
  id,
  connected,
  handleDisconnect,
  tooltipPosition,
  style,
  iconPosition
}: HandleWithTooltipProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Handle
            type={type}
            position={position}
            id={id}
            style={style}
            className={`w-3 h-3 border-2 ${connected.isConnected ? 'bg-green-500' : 'bg-gray-300'}`}
          />
        </TooltipTrigger>
        <TooltipContent>
          <p>{connected.isConnected ? 'Connected' : 'Not connected'}</p>
          {connected.isConnected && (
            <button 
              onClick={() => handleDisconnect(id)}
              className="text-red-500 text-xs hover:underline"
            >
              Disconnect
            </button>
          )}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
