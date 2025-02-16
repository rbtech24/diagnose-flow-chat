
import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';

function DiagnosisNode({ data }) {
  return (
    <Card className="min-w-[200px] max-w-[300px] p-4 bg-white shadow-sm border-2">
      <Handle type="target" position={Position.Top} className="!bg-gray-300" />
      
      <div className="space-y-3">
        <Badge variant="outline" className="mb-2">
          {data.type}
        </Badge>
        
        <h3 className="font-medium text-sm">{data.label}</h3>
        
        <p className="text-sm text-gray-600">
          {data.content}
        </p>

        {data.options && (
          <div className="flex flex-wrap gap-2 mt-2">
            {data.options.map((option: string, index: number) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {option}
              </Badge>
            ))}
          </div>
        )}
      </div>

      <Handle type="source" position={Position.Bottom} className="!bg-gray-300" />
    </Card>
  );
}

export default memo(DiagnosisNode);
