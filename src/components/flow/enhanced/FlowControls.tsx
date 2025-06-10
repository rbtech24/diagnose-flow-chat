
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useReactFlow } from '@xyflow/react';
import { 
  ZoomIn, 
  ZoomOut, 
  Maximize, 
  Grid3X3, 
  AlignLeft,
  AlignCenter,
  AlignRight,
  RotateCcw
} from 'lucide-react';

interface FlowControlsProps {
  snapToGrid: boolean;
  onSnapToggle: () => void;
  onAlignNodes: (alignment: 'left' | 'center' | 'right' | 'top' | 'middle' | 'bottom') => void;
  onAutoLayout: () => void;
}

export function FlowControls({ 
  snapToGrid, 
  onSnapToggle, 
  onAlignNodes, 
  onAutoLayout 
}: FlowControlsProps) {
  const { zoomIn, zoomOut, fitView, getZoom } = useReactFlow();

  const handleZoomIn = () => zoomIn({ duration: 300 });
  const handleZoomOut = () => zoomOut({ duration: 300 });
  const handleFitView = () => fitView({ duration: 500, padding: 0.1 });

  return (
    <Card className="absolute bottom-4 right-4 z-20 p-2 bg-background/90 backdrop-blur-sm border shadow-lg">
      <div className="flex flex-col gap-2">
        {/* Zoom Controls */}
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="sm"
            onClick={handleZoomIn}
            className="h-8 w-8 p-0"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleZoomOut}
            className="h-8 w-8 p-0"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleFitView}
            className="h-8 w-8 p-0"
            title="Fit to Screen"
          >
            <Maximize className="w-4 h-4" />
          </Button>
        </div>

        <Separator />

        {/* Grid and Snap Controls */}
        <div className="flex items-center gap-1">
          <Button
            variant={snapToGrid ? "default" : "outline"}
            size="sm"
            onClick={onSnapToggle}
            className="h-8 w-8 p-0"
            title="Toggle Grid Snap"
          >
            <Grid3X3 className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onAutoLayout}
            className="h-8 w-8 p-0"
            title="Auto Layout"
          >
            <RotateCcw className="w-4 h-4" />
          </Button>
        </div>

        <Separator />

        {/* Alignment Controls */}
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onAlignNodes('left')}
            className="h-8 w-8 p-0"
            title="Align Left"
          >
            <AlignLeft className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onAlignNodes('center')}
            className="h-8 w-8 p-0"
            title="Align Center"
          >
            <AlignCenter className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onAlignNodes('right')}
            className="h-8 w-8 p-0"
            title="Align Right"
          >
            <AlignRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
