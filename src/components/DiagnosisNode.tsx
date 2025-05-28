
import { memo, useMemo } from 'react';
import { Handle, NodeProps, Position } from '@xyflow/react';
import { HandleWithTooltip } from './diagnosis/HandleWithTooltip';
import { NodeHandles } from './diagnosis/NodeHandles';
import { MediaContent } from './diagnosis/MediaContent';
import { TechnicalContent } from './diagnosis/TechnicalContent';
import { MediaItem } from '@/types/node-config';

// Utility function to sanitize HTML content
const sanitizeHtml = (html: string): string => {
  // Basic XSS protection - remove script tags and dangerous attributes
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/on\w+="[^"]*"/gi, '')
    .replace(/javascript:/gi, '');
};

const DiagnosisNode = memo(({ id, data, selected, type }: NodeProps) => {
  // Handle different node types
  const isFlowTitle = type === 'flowTitle';
  const isFlowNode = type === 'flowNode';
  const isFlowAnswer = type === 'flowAnswer';

  // Set node title based on node type and available data
  const nodeTitle = data.title || data.label || 'Node';
  
  // Memoize string content extraction to prevent unnecessary re-renders
  const nodeContent = useMemo((): string => {
    const richInfo = data.richInfo;
    const content = data.content;
    
    if (typeof richInfo === 'string') return richInfo;
    if (typeof content === 'string') return content;
    return '';
  }, [data.richInfo, data.content]);

  // Memoize node class calculation
  const nodeClass = useMemo(() => {
    let baseClass = 'p-3 border rounded bg-white w-[200px]';
    if (selected) {
      baseClass += ' border-blue-500 shadow-md';
    } else {
      baseClass += ' border-gray-300';
    }

    // Add specific styling based on node type
    if (isFlowTitle) {
      baseClass += ' bg-slate-100';
    } else if (isFlowAnswer) {
      baseClass += ' bg-green-50 border-green-200';
    }

    return baseClass;
  }, [selected, isFlowTitle, isFlowAnswer]);

  // Determine if node has warning icon
  const hasWarningIcon = data.warningIcon && data.warningIcon !== "";

  // Memoize connected state object to prevent unnecessary re-renders
  const connectedState = useMemo(() => ({
    top: { isConnected: false, isNoOutcome: false },
    right: { isConnected: false, isNoOutcome: false },
    bottom: { isConnected: false, isNoOutcome: false },
    left: { isConnected: false, isNoOutcome: false }
  }), []);

  // Memoize handle disconnect function
  const handleDisconnect = useMemo(() => (handleId: string) => {
    // Handle disconnect functionality would go here
  }, []);

  // Memoize sanitized content to prevent XSS attacks
  const sanitizedContent = useMemo(() => {
    if (!nodeContent || nodeContent.trim() === '') return null;
    return sanitizeHtml(nodeContent);
  }, [nodeContent]);

  return (
    <div className={nodeClass}>
      {/* Render handles based on node type */}
      {isFlowAnswer ? (
        // Flow Answer only needs a target handle
        <Handle
          type="target"
          position={Position.Top}
          className="w-3 h-3 border-2"
          id="target"
        />
      ) : (
        // For all other nodes, render appropriate handles
        <>
          <Handle
            type="target"
            position={Position.Top}
            className="w-3 h-3 border-2"
            id="target"
          />
          
          {/* Source handles - different for different node types */}
          {isFlowTitle || isFlowNode ? (
            // Flow Title and Flow Node typically have yes/no or similar handles
            <>
              {data.yes !== undefined && (
                <HandleWithTooltip
                  type="source"
                  position={Position.Bottom}
                  id="a"
                  connected={{ isConnected: false, isNoOutcome: false }}
                  handleDisconnect={handleDisconnect}
                  tooltipPosition="bottom"
                  style={{ left: '30%' }}
                  iconPosition="bottom"
                />
              )}
              {data.no !== undefined && (
                <HandleWithTooltip
                  type="source"
                  position={Position.Bottom}
                  id="b"
                  connected={{ isConnected: false, isNoOutcome: false }}
                  handleDisconnect={handleDisconnect}
                  tooltipPosition="bottom"
                  style={{ left: '70%' }}
                  iconPosition="bottom"
                />
              )}
            </>
          ) : (
            // For standard diagnosis nodes
            <NodeHandles connected={connectedState} handleDisconnect={handleDisconnect} />
          )}
        </>
      )}

      {/* Node Header */}
      <div className="font-medium text-center relative">
        {hasWarningIcon && (
          <div className="absolute left-0 top-0">
            {data.warningIcon === "electric" ? (
              <span role="img" aria-label="electric" className="text-yellow-500">⚡</span>
            ) : (
              <span role="img" aria-label="warning" className="text-yellow-500">⚠️</span>
            )}
          </div>
        )}
        {nodeTitle}
      </div>

      {/* Node Content - XSS protected */}
      {!isFlowAnswer && sanitizedContent && (
        <div className="text-xs mt-2 text-gray-600 max-h-[150px] overflow-auto">
          <div dangerouslySetInnerHTML={{ __html: sanitizedContent }} />
        </div>
      )}

      {/* Media content if present */}
      {data.media && Array.isArray(data.media) && data.media.length > 0 && (
        <MediaContent media={data.media as MediaItem[]} />
      )}

      {/* Technical content if present */}
      {data.technicalSpecs && !isFlowTitle && !isFlowNode && !isFlowAnswer && (
        <TechnicalContent 
          technicalSpecs={data.technicalSpecs} 
          type={data.type as string} 
        />
      )}
    </div>
  );
});

DiagnosisNode.displayName = 'DiagnosisNode';

export default DiagnosisNode;
