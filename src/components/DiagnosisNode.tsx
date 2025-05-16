
import { memo } from 'react';
import { Handle, NodeProps, Position } from '@xyflow/react';
import { HandleWithTooltip } from './diagnosis/HandleWithTooltip';
import { NodeHandles } from './diagnosis/NodeHandles';
import { MediaContent } from './diagnosis/MediaContent';
import { TechnicalContent } from './diagnosis/TechnicalContent';

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
                  label="Yes"
                  style={{ left: '30%' }}
                />
              )}
              {data.no !== undefined && (
                <HandleWithTooltip
                  type="source"
                  position={Position.Bottom}
                  id="b"
                  label="No"
                  style={{ left: '70%' }}
                />
              )}
            </>
          ) : (
            // For standard diagnosis nodes
            <NodeHandles data={data} />
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

      {/* Node Content */}
      {nodeContent && !isFlowAnswer && (
        <div 
          className="text-xs mt-2 text-gray-600 max-h-[150px] overflow-auto"
          dangerouslySetInnerHTML={{ __html: nodeContent }}
        />
      )}

      {/* Media content if present */}
      {data.media && data.media.length > 0 && (
        <MediaContent media={data.media} />
      )}

      {/* Technical content if present */}
      {data.technicalSpecs && !isFlowTitle && !isFlowNode && !isFlowAnswer && (
        <TechnicalContent specs={data.technicalSpecs} />
      )}
    </div>
  );
});

DiagnosisNode.displayName = 'DiagnosisNode';

export default DiagnosisNode;
