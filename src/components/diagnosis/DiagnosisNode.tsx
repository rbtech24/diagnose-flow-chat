
import React, { memo, useMemo } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { NodeHandles } from './NodeHandles';
import { MediaContent } from './MediaContent';
import { TechnicalContent } from './TechnicalContent';
import { NodeData, TechnicalSpecs } from '@/types/node-config';
import { ApplicationError } from '@/types/error';

interface DiagnosisNodeProps extends NodeProps {
  data: NodeData;
}

const DiagnosisNode = memo(({ data, id }: DiagnosisNodeProps) => {
  const nodeData = data as NodeData;
  
  // Properly type the node content with error handling
  const nodeContent = useMemo((): string => {
    try {
      if (typeof nodeData.content === 'string') {
        return nodeData.content;
      }
      if (typeof nodeData.richInfo === 'string') {
        return nodeData.richInfo;
      }
      return '';
    } catch (error) {
      console.error('Error processing node content:', error);
      return '';
    }
  }, [nodeData.content, nodeData.richInfo]);

  // Type-safe technical specs with default values
  const technicalSpecs = useMemo((): TechnicalSpecs => {
    if (nodeData.technicalSpecs && typeof nodeData.technicalSpecs === 'object') {
      return {
        range: nodeData.technicalSpecs.range || { min: 0, max: 0 },
        testPoints: nodeData.technicalSpecs.testPoints,
        value: nodeData.technicalSpecs.value,
        measurementPoints: nodeData.technicalSpecs.measurementPoints,
        points: nodeData.technicalSpecs.points
      };
    }
    return {
      range: { min: 0, max: 0 }
    };
  }, [nodeData.technicalSpecs]);

  // Safely handle connections with proper typing
  const connected = useMemo(() => {
    return {
      top: { isConnected: false, isNoOutcome: false },
      right: { isConnected: false, isNoOutcome: false },
      bottom: { isConnected: false, isNoOutcome: false },
      left: { isConnected: false, isNoOutcome: false }
    };
  }, []);

  const handleDisconnect = (handleId: string): void => {
    try {
      console.log(`Disconnecting handle: ${handleId} from node: ${id}`);
      // Implementation for disconnecting handles
    } catch (error) {
      const applicationError: ApplicationError = {
        message: `Failed to disconnect handle: ${handleId}`,
        code: 'HANDLE_DISCONNECT_ERROR',
        timestamp: new Date()
      };
      console.error('Handle disconnect error:', applicationError);
    }
  };

  // Type-safe node type determination
  const getNodeTypeColor = (type?: string): string => {
    switch (type) {
      case 'question': return 'bg-blue-50 border-blue-200';
      case 'test': return 'bg-green-50 border-green-200';
      case 'solution': return 'bg-purple-50 border-purple-200';
      case 'measurement': return 'bg-yellow-50 border-yellow-200';
      default: return 'bg-gray-50 border-gray-200';
    }
  };

  const cardClassName = `min-w-[200px] max-w-[300px] ${getNodeTypeColor(nodeData.type)}`;

  return (
    <Card className={cardClassName}>
      <Handle
        type="target"
        position={Position.Top}
        id="target"
        className="w-3 h-3 border-2 bg-gray-300"
      />
      
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium">
            {nodeData.title || 'Untitled Node'}
          </CardTitle>
          {nodeData.type && (
            <Badge variant="secondary" className="text-xs">
              {nodeData.type}
            </Badge>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        {nodeContent && (
          <div 
            className="text-sm text-gray-700 mb-2"
            dangerouslySetInnerHTML={{ __html: nodeContent }}
          />
        )}
        
        {nodeData.media && nodeData.media.length > 0 && (
          <MediaContent media={nodeData.media} />
        )}
        
        {nodeData.technicalSpecs && (
          <TechnicalContent 
            technicalSpecs={technicalSpecs} 
            type={nodeData.type || ''} 
          />
        )}
        
        {(nodeData.yes || nodeData.no) && (
          <div className="mt-2 text-xs text-gray-600">
            <div>Yes: {nodeData.yes || 'Continue'}</div>
            <div>No: {nodeData.no || 'Stop'}</div>
          </div>
        )}
      </CardContent>
      
      <NodeHandles 
        connected={connected}
        handleDisconnect={handleDisconnect}
      />
    </Card>
  );
});

DiagnosisNode.displayName = 'DiagnosisNode';

export default DiagnosisNode;
