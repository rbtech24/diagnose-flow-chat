
import React, { memo, useCallback, useState } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Camera, 
  FileText, 
  AlertTriangle, 
  CheckCircle, 
  HelpCircle, 
  Play,
  Pause,
  Clock,
  Settings
} from 'lucide-react';
import { cn } from '@/lib/utils';

export type NodeType = 
  | 'start' 
  | 'question' 
  | 'instruction' 
  | 'condition' 
  | 'end' 
  | 'media' 
  | 'decision' 
  | 'warning'
  | 'info';

export interface DiagnosisNodeData {
  id: string;
  type: NodeType;
  title: string;
  content: string;
  options?: Array<{
    id: string;
    label: string;
    value: string;
    nextNodeId?: string;
  }>;
  media?: {
    type: 'image' | 'video' | 'pdf';
    url: string;
    description?: string;
  };
  timeEstimate?: number;
  required?: boolean;
  warning?: string;
  technicalSpecs?: {
    tools?: string[];
    skills?: string[];
    safetyWarnings?: string[];
  };
  validation?: {
    required: boolean;
    pattern?: string;
    message?: string;
  };
  metadata?: {
    category?: string;
    difficulty?: 'easy' | 'medium' | 'hard';
    tags?: string[];
  };
  [key: string]: unknown; // Add index signature to make it compatible with Record<string, unknown>
}

// Remove the extends NodeProps to avoid the type conflict
interface DiagnosisNodeProps {
  id: string;
  data: DiagnosisNodeData;
  isActive?: boolean;
  isCompleted?: boolean;
  onNodeAction?: (nodeId: string, action: string, data?: any) => void;
  selected?: boolean;
}

const nodeIcons = {
  start: Play,
  question: HelpCircle,
  instruction: FileText,
  condition: AlertTriangle,
  end: CheckCircle,
  media: Camera,
  decision: Settings,
  warning: AlertTriangle,
  info: FileText
};

const nodeColors = {
  start: 'border-green-500 bg-green-50',
  question: 'border-blue-500 bg-blue-50',
  instruction: 'border-yellow-500 bg-yellow-50',
  condition: 'border-orange-500 bg-orange-50',
  end: 'border-green-600 bg-green-100',
  media: 'border-purple-500 bg-purple-50',
  decision: 'border-indigo-500 bg-indigo-50',
  warning: 'border-red-500 bg-red-50',
  info: 'border-gray-500 bg-gray-50'
};

const DiagnosisNode: React.FC<DiagnosisNodeProps> = memo(({
  id,
  data,
  isActive = false,
  isCompleted = false,
  onNodeAction,
  selected
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [userInput, setUserInput] = useState('');

  const IconComponent = nodeIcons[data.type] || FileText;
  const nodeColorClass = nodeColors[data.type] || nodeColors.info;

  const handleAction = useCallback((action: string, actionData?: any) => {
    onNodeAction?.(data.id, action, actionData);
  }, [data.id, onNodeAction]);

  const renderContent = () => {
    if (!data.content) return null;

    return (
      <div className="text-sm text-gray-600 mt-2">
        {typeof data.content === 'string' ? data.content : String(data.content)}
      </div>
    );
  };

  const renderOptions = () => {
    if (!data.options?.length) return null;

    return (
      <div className="mt-3 space-y-2">
        {data.options.map((option) => (
          <Button
            key={option.id}
            variant="outline"
            size="sm"
            className="w-full justify-start text-left"
            onClick={() => handleAction('selectOption', option)}
          >
            {option.label}
          </Button>
        ))}
      </div>
    );
  };

  const renderMedia = () => {
    if (!data.media) return null;

    return (
      <div className="mt-3 p-2 border rounded bg-gray-50">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Camera className="w-4 h-4" />
          <span>{data.media.type.toUpperCase()}</span>
        </div>
        {data.media.description && (
          <p className="text-xs text-gray-500 mt-1">{data.media.description}</p>
        )}
      </div>
    );
  };

  const renderTechnicalInfo = () => {
    if (!data.technicalSpecs && !data.timeEstimate) return null;

    return (
      <div className="mt-3 space-y-2">
        {data.timeEstimate && (
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <Clock className="w-3 h-3" />
            <span>{data.timeEstimate} min</span>
          </div>
        )}
        
        {data.technicalSpecs?.tools?.length && (
          <div className="text-xs">
            <span className="font-medium">Tools: </span>
            <span className="text-gray-600">
              {data.technicalSpecs.tools.join(', ')}
            </span>
          </div>
        )}

        {data.technicalSpecs?.safetyWarnings?.length && (
          <div className="flex items-start gap-1 text-xs text-red-600">
            <AlertTriangle className="w-3 h-3 mt-0.5" />
            <div>
              {data.technicalSpecs.safetyWarnings.map((warning, index) => (
                <div key={index}>{warning}</div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <Card 
      className={cn(
        'min-w-[250px] transition-all duration-200',
        nodeColorClass,
        isActive && 'ring-2 ring-blue-400 shadow-lg',
        isCompleted && 'opacity-75',
        selected && 'ring-2 ring-gray-400'
      )}
    >
      <Handle 
        type="target" 
        position={Position.Top} 
        className="w-3 h-3 bg-gray-400"
      />
      
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <IconComponent className="w-4 h-4" />
            <h3 className="font-medium text-sm">{data.title}</h3>
          </div>
          
          <div className="flex items-center gap-1">
            {data.required && (
              <Badge variant="destructive" className="text-xs px-1 py-0">
                Required
              </Badge>
            )}
            
            {data.metadata?.difficulty && (
              <Badge 
                variant={data.metadata.difficulty === 'hard' ? 'destructive' : 'secondary'}
                className="text-xs px-1 py-0"
              >
                {data.metadata.difficulty}
              </Badge>
            )}
            
            {isCompleted && (
              <CheckCircle className="w-4 h-4 text-green-600" />
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {renderContent()}
        {renderOptions()}
        {renderMedia()}
        {renderTechnicalInfo()}
        
        {data.warning && (
          <div className="mt-3 p-2 bg-yellow-100 border border-yellow-300 rounded text-xs text-yellow-800">
            <div className="flex items-start gap-1">
              <AlertTriangle className="w-3 h-3 mt-0.5" />
              <span>{data.warning}</span>
            </div>
          </div>
        )}

        {data.metadata?.tags?.length && (
          <div className="mt-3 flex flex-wrap gap-1">
            {data.metadata.tags.map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs px-1 py-0">
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>

      <Handle 
        type="source" 
        position={Position.Bottom} 
        className="w-3 h-3 bg-gray-400"
      />
    </Card>
  );
});

DiagnosisNode.displayName = 'DiagnosisNode';

export default DiagnosisNode;
