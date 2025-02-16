
import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';

function DiagnosisNode({ data }) {
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

      <Handle type="source" position={Position.Bottom} className="!bg-gray-300" />
    </Card>
  );
}

export default memo(DiagnosisNode);
