
import React, { memo, useMemo } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MediaContent } from './MediaContent';
import { TechnicalContent } from './TechnicalContent';
import { WarningIcon } from './WarningIcons';
import { NodeData, TechnicalSpecs } from '@/types/node-config';

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

  // Parse warning configuration - look for warning in any field
  const warningConfig = useMemo(() => {
    // Check if warning is in the main data
    if (nodeData.warning && typeof nodeData.warning === 'object') {
      return nodeData.warning;
    }
    
    // Check if there's a field with warning content - type-safe approach
    if (nodeData.fields && Array.isArray(nodeData.fields)) {
      const warningField = nodeData.fields.find((field: any) => field.id === 'warning' || field.type === 'warning');
      
      if (warningField && warningField.content) {
        try {
          return JSON.parse(warningField.content);
        } catch {
          return undefined;
        }
      }
    }
    
    return undefined;
  }, [nodeData.warning, nodeData.fields]);

  // Type-safe node type determination with visual indicators
  const getNodeTypeColor = (type?: string): string => {
    switch (type) {
      case 'start': return 'bg-green-50 border-green-400 border-2';
      case 'question': return 'bg-blue-50 border-blue-200';
      case 'action': return 'bg-purple-50 border-purple-200';
      case 'test': return 'bg-yellow-50 border-yellow-200';
      case 'solution': return 'bg-red-50 border-red-200';
      case 'measurement': return 'bg-orange-50 border-orange-200';
      default: return 'bg-gray-50 border-gray-200';
    }
  };

  const getNodeShape = (type?: string): string => {
    switch (type) {
      case 'start': return 'rounded-full';
      case 'solution': return 'rounded-none';
      default: return 'rounded-lg';
    }
  };

  // Render options with proper type handling and explicit return type
  const renderOptions = (): React.ReactNode => {
    if (nodeData.options && nodeData.options.length > 0 && nodeData.type === 'question') {
      return (
        <div className="mt-2">
          <div className="text-xs text-gray-600 mb-1">Options:</div>
          <ul className="text-xs text-gray-600 list-disc list-inside">
            {nodeData.options.map((option: string | number | boolean | null | undefined, index: number) => {
              const optionText = option != null ? String(option) : '';
              return (
                <li key={index}>{optionText}</li>
              );
            })}
          </ul>
        </div>
      );
    }
    return null;
  };

  // Don't render start nodes visually (they're workflow metadata)
  if (nodeData.type === 'start') {
    return null;
  }

  const cardClassName = `min-w-[200px] max-w-[300px] ${getNodeTypeColor(nodeData.type)} ${getNodeShape(nodeData.type)}`;

  return (
    <Card className={cardClassName}>
      {/* Target handle - top */}
      <Handle
        type="target"
        position={Position.Top}
        id="target"
        className="w-3 h-3 border-2 bg-gray-300 !border-gray-400"
        style={{ background: '#d1d5db' }}
      />
      
      {/* Target handle - left */}
      <Handle
        type="target"
        position={Position.Left}
        id="left-target"
        className="w-3 h-3 border-2 bg-gray-300 !border-gray-400"
        style={{ background: '#d1d5db' }}
      />
      
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium">
            {nodeData.title || nodeData.label || 'Untitled Step'}
          </CardTitle>
          {nodeData.type && (
            <Badge variant="secondary" className="text-xs capitalize">
              {nodeData.type}
            </Badge>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        {warningConfig && (
          <WarningIcon 
            type={warningConfig.type}
            includeLicenseText={warningConfig.includeLicenseText}
            className="mb-3"
          />
        )}
        
        {nodeContent && (
          <div className="text-sm text-gray-700 mb-2">
            {nodeContent}
          </div>
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
        
        {(nodeData.yes || nodeData.no) && nodeData.type === 'question' && (
          <div className="mt-2 text-xs text-gray-600">
            <div>Yes: {String(nodeData.yes) || 'Continue'}</div>
            <div>No: {String(nodeData.no) || 'Stop'}</div>
          </div>
        )}

        {renderOptions()}
      </CardContent>
      
      {/* Source handles */}
      <Handle
        type="source"
        position={Position.Bottom}
        id="source"
        className="w-3 h-3 border-2 bg-gray-300 !border-gray-400"
        style={{ background: '#d1d5db' }}
      />
      
      <Handle
        type="source"
        position={Position.Right}
        id="right"
        className="w-3 h-3 border-2 bg-gray-300 !border-gray-400"
        style={{ background: '#d1d5db' }}
      />
    </Card>
  );
});

DiagnosisNode.displayName = 'DiagnosisNode';

export default DiagnosisNode;
