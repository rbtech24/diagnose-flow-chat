
import { memo } from 'react';
import { Handle, Position, useStore, useReactFlow } from '@xyflow/react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { toast } from '@/hooks/use-toast';

function DiagnosisNode({ id, data }) {
  const { setEdges } = useReactFlow();
  
  // Get connected edges for this node to check handle connections
  const connected = useStore((store) => {
    const edges = store.edges;
    const handleConnections = (edges, nodeId, handleId = null) => 
      edges.some(edge => 
        (edge.source === nodeId && (!handleId || edge.sourceHandle === handleId)) ||
        (edge.target === nodeId && (!handleId || edge.targetHandle === handleId))
      );

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

  const handleStyle = (isConnected) => ({
    width: '12px',
    height: '12px',
    border: '2px solid',
    borderColor: isConnected ? '#22c55e' : '#ef4444',
    backgroundColor: isConnected ? '#bbf7d0' : '#fecaca',
    cursor: isConnected ? 'pointer' : 'default',
  });

  return (
    <Card className="min-w-[200px] max-w-[300px] p-4 bg-white shadow-sm border-2">
      <Handle 
        type="target" 
        position={Position.Top} 
        id="top"
        style={handleStyle(connected.top)}
        onClick={() => connected.top && handleDisconnect('top')}
      />
      
      <Handle
        type="target"
        position={Position.Left}
        id="left"
        style={handleStyle(connected.left)}
        onClick={() => connected.left && handleDisconnect('left')}
      />

      <div className="space-y-3">
        <Badge variant="outline" className="mb-2">
          {data.type}
        </Badge>
        
        <h3 className="font-medium text-sm">{data.label}</h3>
        
        <p className="text-sm text-gray-600">
          {data.content}
        </p>

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

      <Handle
        type="source"
        position={Position.Right}
        id="right"
        style={handleStyle(connected.right)}
        onClick={() => connected.right && handleDisconnect('right')}
      />

      <Handle 
        type="source" 
        position={Position.Bottom}
        id="bottom" 
        style={handleStyle(connected.bottom)}
        onClick={() => connected.bottom && handleDisconnect('bottom')}
      />
    </Card>
  );
}

export default memo(DiagnosisNode);
