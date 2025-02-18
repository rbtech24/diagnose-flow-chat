
import React from 'react';
import { Position } from '@xyflow/react';
import { HandleWithTooltip } from './HandleWithTooltip';
import { ArrowDown, ArrowUp } from 'lucide-react';

interface HandlePairProps {
  position: Position;
  connected: { isConnected: boolean; isNoOutcome: boolean };
  handleDisconnect: (handleId: string) => void;
  orientation: 'horizontal' | 'vertical';
}

export function HandlePair({ position, connected, handleDisconnect, orientation }: HandlePairProps) {
  const positionToId = {
    [Position.Top]: 'top',
    [Position.Bottom]: 'bottom',
    [Position.Left]: 'left',
    [Position.Right]: 'right'
  };

  const id = positionToId[position];
  const isVertical = orientation === 'vertical';
  const containerClassName = isVertical 
    ? "flex flex-col items-center gap-1"
    : "flex items-center gap-1";

  const getTooltipPosition = () => {
    switch (position) {
      case Position.Top: return 'top';
      case Position.Bottom: return 'bottom';
      case Position.Left: return 'left';
      case Position.Right: return 'right';
    }
  };

  const getArrowIcon = () => {
    switch (position) {
      case Position.Top: return { incoming: ArrowDown, outgoing: ArrowUp };
      case Position.Bottom: return { incoming: ArrowUp, outgoing: ArrowDown };
      default: return null;
    }
  };

  const arrows = getArrowIcon();
  const tooltipPosition = getTooltipPosition();

  return (
    <div className={containerClassName}>
      <HandleWithTooltip
        type="target"
        position={position}
        id={id}
        connected={connected}
        handleDisconnect={handleDisconnect}
        tooltipPosition={tooltipPosition}
        style={{
          [isVertical ? 'top' : 'left']: '-12px'
        }}
        Icon={arrows?.incoming}
        iconPosition={position === Position.Top ? 'top' : 'bottom'}
      />
      <HandleWithTooltip
        type="source"
        position={position}
        id={id}
        connected={connected}
        handleDisconnect={handleDisconnect}
        tooltipPosition={tooltipPosition}
        style={{
          [isVertical ? 'top' : 'left']: '12px'
        }}
        Icon={arrows?.outgoing}
        iconPosition={position === Position.Top ? 'top' : 'bottom'}
      />
    </div>
  );
}
