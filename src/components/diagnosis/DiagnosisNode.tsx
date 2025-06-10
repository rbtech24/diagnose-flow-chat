
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
  Settings,
  File,
  Video
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
  } | Array<{
    type: 'image' | 'video' | 'pdf';
    url: string;
    description?: string;
  }>;
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
  [key: string]: unknown;
}

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

  const renderMediaItem = (mediaItem: { type: 'image' | 'video' | 'pdf'; url: string; description?: string }, index: number) => {
    const mediaType = mediaItem.type || 'unknown';
    
    return (
      <div key={index} className="mt-2 border rounded-md overflow-hidden bg-white">
        {mediaType === 'image' && (
          <div>
            <img 
              src={mediaItem.url} 
              alt={mediaItem.description || 'Node media'} 
              className="w-full h-32 object-cover"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                e.currentTarget.nextElementSibling!.style.display = 'flex';
              }}
            />
            <div className="hidden items-center justify-center h-32 bg-gray-100 text-gray-500">
              <Camera className="w-8 h-8" />
            </div>
          </div>
        )}
        
        {mediaType === 'video' && (
          <div>
            <video 
              src={mediaItem.url} 
              className="w-full h-32 object-cover" 
              controls
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                e.currentTarget.nextElementSibling!.style.display = 'flex';
              }}
            />
            <div className="hidden items-center justify-center h-32 bg-gray-100 text-gray-500">
              <Video className="w-8 h-8" />
            </div>
          </div>
        )}
        
        {mediaType === 'pdf' && (
          <div className="p-3 flex items-center gap-2 bg-gray-50">
            <File className="w-5 h-5 text-red-600" />
            <a 
              href={mediaItem.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-sm text-blue-600 hover:underline flex-1 truncate"
            >
              {mediaItem.description || 'View PDF Document'}
            </a>
          </div>
        )}
        
        {mediaItem.description && mediaType !== 'pdf' && (
          <div className="p-2 text-xs text-gray-600 bg-gray-50">
            {mediaItem.description}
          </div>
        )}
      </div>
    );
  };

  const renderMedia = () => {
    if (!data.media) return null;

    // Handle both single media object and array of media objects
    const mediaItems = Array.isArray(data.media) ? data.media : [data.media];
    
    if (mediaItems.length === 0) return null;

    return (
      <div className="mt-3">
        <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
          <Camera className="w-3 h-3" />
          <span>Media ({mediaItems.length})</span>
        </div>
        {mediaItems.map((item, index) => renderMediaItem(item, index))}
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
        'min-w-[250px] max-w-[300px] transition-all duration-200 relative',
        nodeColorClass,
        isActive && 'ring-2 ring-blue-400 shadow-lg',
        isCompleted && 'opacity-75',
        selected && 'ring-2 ring-gray-400'
      )}
    >
      {/* Handles on all 4 sides */}
      <Handle 
        type="target" 
        position={Position.Top} 
        id="top"
        className="w-3 h-3 bg-gray-400 hover:bg-blue-500 transition-colors"
      />
      <Handle 
        type="source" 
        position={Position.Top} 
        id="top-source"
        className="w-3 h-3 bg-gray-400 hover:bg-blue-500 transition-colors"
        style={{ left: '75%' }}
      />
      
      <Handle 
        type="target" 
        position={Position.Right} 
        id="right"
        className="w-3 h-3 bg-gray-400 hover:bg-blue-500 transition-colors"
      />
      <Handle 
        type="source" 
        position={Position.Right} 
        id="right-source"
        className="w-3 h-3 bg-gray-400 hover:bg-blue-500 transition-colors"
        style={{ top: '75%' }}
      />
      
      <Handle 
        type="target" 
        position={Position.Bottom} 
        id="bottom"
        className="w-3 h-3 bg-gray-400 hover:bg-blue-500 transition-colors"
      />
      <Handle 
        type="source" 
        position={Position.Bottom} 
        id="bottom-source"
        className="w-3 h-3 bg-gray-400 hover:bg-blue-500 transition-colors"
        style={{ left: '75%' }}
      />
      
      <Handle 
        type="target" 
        position={Position.Left} 
        id="left"
        className="w-3 h-3 bg-gray-400 hover:bg-blue-500 transition-colors"
      />
      <Handle 
        type="source" 
        position={Position.Left} 
        id="left-source"
        className="w-3 h-3 bg-gray-400 hover:bg-blue-500 transition-colors"
        style={{ top: '75%' }}
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
    </Card>
  );
});

DiagnosisNode.displayName = 'DiagnosisNode';

export default DiagnosisNode;
