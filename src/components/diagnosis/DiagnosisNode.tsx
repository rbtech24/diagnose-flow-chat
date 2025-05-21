
import { memo } from 'react';
import { Handle, NodeProps, Position } from '@xyflow/react';
import { HandleWithTooltip } from './HandleWithTooltip';
import { NodeHandles } from './NodeHandles';
import { MediaContent } from './MediaContent';
import { TechnicalContent } from './TechnicalContent';
import { MediaItem } from '@/types/node-config';

const DiagnosisNode = memo(({ id, data, selected, type }: NodeProps) => {
  // Log the node data to help debug
  console.log(`Rendering node ${id} of type ${type}:`, data);
  
  // Handle different node types
  const isFlowTitle = type === 'flowTitle';
  const isFlowNode = type === 'flowNode';
  const isFlowAnswer = type === 'flowAnswer';

  // Set node title based on node type and available data
  const nodeTitle = data.title || data.label || 'Node';
  
  // Set node content based on node type and available data
  const nodeContent = data.richInfo || data.content || '';

  // Set node class based on type
  let nodeClass = 'p-3 border rounded bg-white w-[200px]';
  if (selected) {
    nodeClass += ' border-blue-500 shadow-md';
  } else {
    nodeClass += ' border-gray-300';
  }

  // Add specific styling based on node type
  if (isFlowTitle) {
    nodeClass += ' bg-slate-100';
  } else if (isFlowAnswer) {
    nodeClass += ' bg-green-50 border-green-200';
  }

  // Determine if node has warning icon
  const hasWarningIcon = data.warningIcon && data.warningIcon !== "";

  // Create a mock connected state object for NodeHandles
  const connectedState = {
    top: { isConnected: false, isNoOutcome: false },
    right: { isConnected: false, isNoOutcome: false },
    bottom: { isConnected: false, isNoOutcome: false },
    left: { isConnected: false, isNoOutcome: false }
  };

  // Mock function for handle disconnect
  const handleDisconnect = (handleId: string) => {
    console.log(`Disconnecting handle: ${handleId}`);
  };

  // Function to render content safely with proper typing
  const renderContent = (content: string | undefined): React.ReactNode => {
    if (typeof content === 'string' && content.trim() !== '') {
      return (
        <div 
          className="text-xs mt-2 text-gray-600 max-h-[150px] overflow-auto"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      );
    }
    return null;
  };

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

      {/* Node Content - safely rendered */}
      {nodeContent && !isFlowAnswer && renderContent(nodeContent)}

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
