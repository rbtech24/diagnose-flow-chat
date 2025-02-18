
import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { getHandleStyle } from '@/utils/handleUtils';
import { ArrowDown, ArrowUp, LucideIcon } from 'lucide-react';

interface HandleWithTooltipProps {
  type: 'source' | 'target';
  position: Position;
  id: string;
  connected: { isConnected: boolean; isNoOutcome: boolean };
  handleDisconnect: (handleId: string) => void;
  tooltipPosition: 'top' | 'bottom' | 'left' | 'right';
  style?: React.CSSProperties;
  Icon?: LucideIcon;
  iconPosition: 'top' | 'bottom';
}

export function HandleWithTooltip({
  type,
  position,
  id,
  connected,
  handleDisconnect,
  tooltipPosition,
  style,
  Icon,
  iconPosition
}: HandleWithTooltipProps) {
  const isIncoming = type === 'target';
  const tooltipClasses = {
    top: '-top-4 left-1/2 -translate-x-1/2',
    bottom: '-bottom-4 left-1/2 -translate-x-1/2',
    left: '-left-12',
    right: '-right-12'
  };

  const iconClasses = {
    top: '-top-4',
    bottom: '-bottom-4'
  };

  return (
    <div className="relative group">
      <Handle
        type={type}
        position={position}
        id={id}
        style={{
          ...getHandleStyle(connected),
          backgroundColor: isIncoming ? '#e2e8f0' : '#f1f5f9',
          border: `2px solid ${isIncoming ? '#94a3b8' : '#64748b'}`,
          transition: 'all 150ms ease-in-out',
          ...style
        }}
        onClick={() => connected.isConnected && handleDisconnect(id)}
      />
      <div 
        className={`
          absolute ${tooltipClasses[tooltipPosition]} 
          opacity-0 scale-95
          group-hover:opacity-100 group-hover:scale-100
          transition-all duration-150 ease-in-out
          text-[10px] bg-gray-800/90 text-white 
          px-1.5 py-0.5 rounded-sm 
          shadow-sm backdrop-blur-[2px]
          whitespace-nowrap
        `}
      >
        {isIncoming ? 'Incoming' : 'Outgoing'}
      </div>
      {Icon && (
        <Icon 
          className={`w-3 h-3 text-gray-${isIncoming ? '400' : '600'} absolute ${iconClasses[iconPosition]}`} 
        />
      )}
    </div>
  );
}
