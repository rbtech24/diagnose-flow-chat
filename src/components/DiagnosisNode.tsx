
import { memo } from 'react';
import { useStore, useReactFlow } from '@xyflow/react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { toast } from '@/hooks/use-toast';
import { NodeHandles } from './diagnosis/NodeHandles';
import { TechnicalContent } from './diagnosis/TechnicalContent';
import { MediaContent } from './diagnosis/MediaContent';

function DiagnosisNode({ id, data }) {
  const { setEdges } = useReactFlow();
  
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

  return (
    <Card className="min-w-[200px] max-w-[300px] p-4 bg-white border-[#1A1F2C] border-2 shadow-[0_4px_12px_rgba(0,0,0,0.1)]">
      <NodeHandles connected={connected} handleDisconnect={handleDisconnect} />
      
      <div className="space-y-3">
        <Badge variant="outline" className="mb-2">
          {data.type}
        </Badge>
        
        <h3 className="font-medium text-sm">{data.label}</h3>
        
        {data.content && (
          <p className="text-sm text-gray-600 whitespace-pre-wrap">
            {data.content}
          </p>
        )}

        <MediaContent media={data.media || []} />
        
        <TechnicalContent 
          type={data.type}
          technicalSpecs={data.technicalSpecs}
        />

        {data.options && data.options.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {data.options.map((option, index) => (
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
    </Card>
  );
}

export default memo(DiagnosisNode);
