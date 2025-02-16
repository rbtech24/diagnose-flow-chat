
import { memo } from 'react';
import { Handle, Position, useStore, useReactFlow } from '@xyflow/react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { toast } from '@/hooks/use-toast';

function DiagnosisNode({ id, data }) {
  const { setEdges } = useReactFlow();
  
  // Get connected edges for this node to check handle connections and edge colors
  const connected = useStore((store) => {
    const edges = store.edges;
    const handleConnections = (edges, nodeId, handleId = null) => {
      const edge = edges.find(edge => 
        (edge.source === nodeId && (!handleId || edge.sourceHandle === handleId)) ||
        (edge.target === nodeId && (!handleId || edge.targetHandle === handleId))
      );
      
      return {
        isConnected: !!edge,
        isNoOutcome: edge?.data?.isNoOutcome || false
      };
    };

    return {
      left: handleConnections(edges, id, 'left'),
      right: handleConnections(edges, id, 'right'),
      top: handleConnections(edges, id, 'top'),
      bottom: handleConnections(edges, id, 'bottom')
    };
  });

  const handleDisconnect = (handleId) => {
    setEdges((edges) => 
      edges.filter(
        (edge) => !(
          (edge.target === id && edge.targetHandle === handleId) ||
          (edge.source === id && edge.sourceHandle === handleId)
        )
      )
    );
    toast({
      title: "Connection Removed",
      description: "The connection has been removed successfully."
    });
  };

  const handleConnect = (params) => {
    // Check if this is a "no" outcome connection
    const isNoOutcome = data.options && 
      data.options.includes('No') && 
      params.sourceHandle === 'right';
    
    // Add the edge with appropriate styling for "no" outcomes
    setEdges((eds) => [
      ...eds,
      {
        ...params,
        data: { isNoOutcome },
        style: isNoOutcome ? { stroke: '#ea384c' } : undefined
      }
    ]);
  };

  const getTechnicalContent = () => {
    if (!data.technicalSpecs) return null;
    
    switch (data.type) {
      case 'voltage-check':
        return (
          <div className="mt-2 text-xs bg-blue-50 p-2 rounded">
            <p>Expected: {data.technicalSpecs.range.min}V - {data.technicalSpecs.range.max}V</p>
            <p>Test Points: {data.technicalSpecs.testPoints}</p>
          </div>
        );
      case 'resistance-check':
        return (
          <div className="mt-2 text-xs bg-blue-50 p-2 rounded">
            <p>Expected: {data.technicalSpecs.value}Ω</p>
            <p>Measure: {data.technicalSpecs.measurementPoints}</p>
          </div>
        );
      case 'inspection':
        return (
          <div className="mt-2 text-xs bg-blue-50 p-2 rounded">
            <div dangerouslySetInnerHTML={{ 
              __html: data.technicalSpecs.points.replace(/\n/g, '<br/>') 
            }} />
          </div>
        );
      default:
        return null;
    }
  };

  const handleStyle = (connection) => ({
    width: '12px',
    height: '12px',
    border: '2px solid',
    borderColor: connection.isConnected 
      ? (connection.isNoOutcome ? '#ea384c' : '#22c55e') 
      : '#ef4444',
    backgroundColor: connection.isConnected 
      ? (connection.isNoOutcome ? '#fecdd3' : '#bbf7d0')
      : '#fecaca',
    cursor: connection.isConnected ? 'pointer' : 'default',
  });

  return (
    <Card className="min-w-[200px] max-w-[300px] p-4 bg-white shadow-sm border-2">
      {/* Allow both source and target on top */}
      <Handle 
        type="source" 
        position={Position.Top} 
        id="top"
        style={{...handleStyle(connected.top), left: 'calc(50% - 12px)'}}
        onClick={() => connected.top.isConnected && handleDisconnect('top')}
      />
      <Handle 
        type="target" 
        position={Position.Top} 
        id="top"
        style={{...handleStyle(connected.top), left: 'calc(50% + 12px)'}}
        onClick={() => connected.top.isConnected && handleDisconnect('top')}
      />
      
      {/* Allow both source and target on left */}
      <Handle
        type="source"
        position={Position.Left}
        id="left"
        style={{...handleStyle(connected.left), top: 'calc(50% - 12px)'}}
        onClick={() => connected.left.isConnected && handleDisconnect('left')}
      />
      <Handle
        type="target"
        position={Position.Left}
        id="left"
        style={{...handleStyle(connected.left), top: 'calc(50% + 12px)'}}
        onClick={() => connected.left.isConnected && handleDisconnect('left')}
      />

      <div className="space-y-3">
        <Badge variant="outline" className="mb-2">
          {data.type}
        </Badge>
        
        <h3 className="font-medium text-sm">{data.label}</h3>
        
        {data.content && (
          <p className="text-sm text-gray-600">
            {data.content}
          </p>
        )}

        {data.media && data.media.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {data.media.map((item, index) => (
              <div key={index} className="relative">
                {item.type === 'image' ? (
                  <img src={item.url} alt="" className="w-20 h-20 object-cover rounded" />
                ) : (
                  <iframe 
                    src={item.url} 
                    className="w-40 h-24 rounded" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                )}
              </div>
            ))}
          </div>
        )}

        {getTechnicalContent()}

        {data.options && (
          <div className="flex flex-wrap gap-2 mt-2">
            {data.options.map((option: string, index: number) => (
              <Badge 
                key={index} 
                variant="secondary" 
                className="text-xs cursor-pointer hover:bg-gray-100"
              >
                {option}
              </Badge>
            ))}
          </div>
        )}
      </div>

      {/* Allow both source and target on right */}
      <Handle
        type="source"
        position={Position.Right}
        id="right"
        style={{...handleStyle(connected.right), top: 'calc(50% - 12px)'}}
        onClick={() => connected.right.isConnected && handleDisconnect('right')}
      />
      <Handle
        type="target"
        position={Position.Right}
        id="right"
        style={{...handleStyle(connected.right), top: 'calc(50% + 12px)'}}
        onClick={() => connected.right.isConnected && handleDisconnect('right')}
      />

      {/* Allow both source and target on bottom */}
      <Handle 
        type="source" 
        position={Position.Bottom}
        id="bottom" 
        style={{...handleStyle(connected.bottom), left: 'calc(50% - 12px)'}}
        onClick={() => connected.bottom.isConnected && handleDisconnect('bottom')}
      />
      <Handle 
        type="target" 
        position={Position.Bottom}
        id="bottom" 
        style={{...handleStyle(connected.bottom), left: 'calc(50% + 12px)'}}
        onClick={() => connected.bottom.isConnected && handleDisconnect('bottom')}
      />
    </Card>
  );
}

export default memo(DiagnosisNode);
