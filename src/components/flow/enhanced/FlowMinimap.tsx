
import React, { useState } from 'react';
import { MiniMap } from '@xyflow/react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Map, X } from 'lucide-react';

interface FlowMinimapProps {
  className?: string;
}

export function FlowMinimap({ className }: FlowMinimapProps) {
  const [isVisible, setIsVisible] = useState(true);

  const nodeColor = (node: any) => {
    switch (node.type) {
      case 'start':
        return '#22c55e';
      case 'question':
        return '#3b82f6';
      case 'decision-tree':
        return '#8b5cf6';
      case 'data-form':
        return '#f59e0b';
      case 'equipment-test':
        return '#ef4444';
      case 'photo-capture':
        return '#ec4899';
      case 'solution':
        return '#10b981';
      default:
        return '#6b7280';
    }
  };

  if (!isVisible) {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsVisible(true)}
        className="absolute top-4 right-4 z-20 bg-background/90 backdrop-blur-sm"
      >
        <Map className="w-4 h-4 mr-2" />
        Show Minimap
      </Button>
    );
  }

  return (
    <Card className="absolute top-4 right-4 z-20 overflow-hidden bg-background/90 backdrop-blur-sm">
      <div className="flex items-center justify-between p-2 border-b">
        <span className="text-sm font-medium">Overview</span>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsVisible(false)}
          className="h-6 w-6 p-0"
        >
          <X className="w-3 h-3" />
        </Button>
      </div>
      <div className="w-64 h-48">
        <MiniMap
          nodeColor={nodeColor}
          maskColor="rgba(0, 0, 0, 0.1)"
          className="!bg-transparent"
          pannable
          zoomable
        />
      </div>
    </Card>
  );
}
