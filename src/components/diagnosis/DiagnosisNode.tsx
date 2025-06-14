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
  Video,
  ArrowRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { WarningIcon } from './WarningIcons';
import { getNodeClasses } from '@/utils/nodeStyle';

export type NodeType = 
  | 'start' 
  | 'question' 
  | 'instruction' 
  | 'condition' 
  | 'end' 
  | 'media' 
  | 'decision' 
  | 'warning'
  | 'info'
  | 'action';

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
  fields?: Array<{
    id: string;
    type: string;
    content?: string;
    [key: string]: unknown;
  }>;
  linkToWorkflow?: {
    workflowName: string;
    stepId?: string;
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
  info: FileText,
  action: ArrowRight
};

const nodeShapes = {
  start: 'rounded-full',
  question: 'rounded-lg',
  instruction: 'rounded-md',
  condition: 'rounded-lg',
  end: 'rounded-full',
  media: 'rounded-xl',
  decision: 'rounded-lg',
  warning: 'rounded-lg',
  info: 'rounded-md',
  action: 'rounded-xl'
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

  const IconComponent = nodeIcons[data.type] || FileText;
  const nodeColorClass = getNodeClasses(data.type);
  const nodeShapeClass = nodeShapes[data.type] || 'rounded-lg';

  const handleAction = useCallback((action: string, actionData?: any) => {
    onNodeAction?.(data.id, action, actionData);
  }, [data.id, onNodeAction]);

  // Helper function to check if content is warning JSON
  const isWarningContent = (content: any) => {
    if (!content) return false;
    
    if (typeof content === 'object' && content.type && 
        ['electric', 'water', 'fire'].includes(content.type)) {
      return true;
    }
    
    if (typeof content === 'string') {
      try {
        const parsed = JSON.parse(content);
        if (parsed && typeof parsed === 'object' && parsed.type && 
            ['electric', 'water', 'fire'].includes(parsed.type)) {
          return true;
        }
      } catch {
        // Not JSON, could be regular content
      }
    }
    
    return false;
  };

  // Helper function to get warning config from fields
  const getWarningConfig = () => {
    if (data.fields && Array.isArray(data.fields)) {
      const warningField = data.fields.find(field => field.id === 'warning');
      
      if (warningField?.content) {
        try {
          if (typeof warningField.content === 'object') {
            return warningField.content;
          } else if (typeof warningField.content === 'string') {
            const parsed = JSON.parse(warningField.content);
            return parsed;
          }
        } catch (error) {
          console.log('Failed to parse warning content:', error);
        }
      }
    }
    return null;
  };

  const renderContent = () => {
    // Start with the main content
    let content = '';
    
    // Check if main content exists and is not warning content
    if (data.content && !isWarningContent(data.content)) {
      content = typeof data.content === 'string' ? data.content : String(data.content);
    }
    
    // Also check richInfo if no main content
    if (!content && data.richInfo && !isWarningContent(data.richInfo)) {
      content = typeof data.richInfo === 'string' ? data.richInfo : String(data.richInfo);
    }
    
    // Check fields for content if still no content found
    if (!content && data.fields && Array.isArray(data.fields)) {
      const contentFields = data.fields.filter(field => {
        return field.type === 'content' && field.content && !isWarningContent(field.content);
      });
      
      if (contentFields.length > 0) {
        content = contentFields
          .map(field => field.content)
          .filter(Boolean)
          .join('\n\n');
      }
    }
    
    // If still no content, use the label or title as fallback
    if (!content) {
      if (data.title && typeof data.title === 'string') {
        content = data.title;
      } else if (data.label && typeof data.label === 'string') {
        content = data.label;
      }
    }

    if (!content) return null;

    return (
      <div className="text-sm text-gray-600 mt-2 whitespace-pre-wrap">
        {content}
      </div>
    );
  };

  const renderOptions = () => {
    // Check both direct options and field-based options
    let options = data.options || [];
    
    if (data.fields && Array.isArray(data.fields)) {
      const optionsField = data.fields.find(field => field.type === 'options');
      if (optionsField?.options && Array.isArray(optionsField.options)) {
        options = optionsField.options;
      }
    }
    
    if (!options.length) return null;

    return (
      <div className="mt-3 space-y-2">
        {options.map((option, index) => (
          <Button
            key={typeof option === 'object' ? option.id || index : index}
            variant="outline"
            size="sm"
            className="w-full justify-start text-left"
            onClick={() => handleAction('selectOption', option)}
          >
            {typeof option === 'object' ? option.label || option.value : option}
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
                const target = e.currentTarget as HTMLImageElement;
                const nextSibling = target.nextElementSibling as HTMLElement;
                target.style.display = 'none';
                if (nextSibling) {
                  nextSibling.style.display = 'flex';
                }
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
                const target = e.currentTarget as HTMLVideoElement;
                const nextSibling = target.nextElementSibling as HTMLElement;
                target.style.display = 'none';
                if (nextSibling) {
                  nextSibling.style.display = 'flex';
                }
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

  const renderWarning = () => {
    const warningConfig = getWarningConfig();
    
    // Also check if main content is warning JSON
    if (!warningConfig && data.content && isWarningContent(data.content)) {
      try {
        let parsed;
        if (typeof data.content === 'object') {
          parsed = data.content;
        } else {
          parsed = JSON.parse(data.content);
        }
        
        if (parsed && parsed.type) {
          return (
            <div className="mt-3">
              <WarningIcon 
                type={parsed.type}
                includeLicenseText={parsed.includeLicenseText || false}
                className="text-xs scale-75 origin-top-left"
              />
            </div>
          );
        }
      } catch (error) {
        console.log('Failed to parse warning from main content:', error);
      }
    }
    
    if (warningConfig && warningConfig.type) {
      return (
        <div className="mt-3">
          <WarningIcon 
            type={warningConfig.type}
            includeLicenseText={warningConfig.includeLicenseText || false}
            className="text-xs scale-75 origin-top-left"
          />
        </div>
      );
    }

    return null;
  };

  // Special styling for start nodes
  const isStartNode = data.type === 'start';
  const startNodeStyle = isStartNode ? 'ring-4 ring-green-300 ring-opacity-50' : '';

  // Get the display title
  const getDisplayTitle = () => {
    if (data.title && typeof data.title === 'string') {
      return data.title;
    }
    if (data.label && typeof data.label === 'string') {
      return data.label;
    }
    return `${data.type || 'Node'} ${data.id}`;
  };

  return (
    <Card 
      className={cn(
        'min-w-[250px] max-w-[300px] transition-all duration-200 relative',
        nodeColorClass,
        nodeShapeClass,
        startNodeStyle,
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
            <h3 className="font-medium text-sm">{getDisplayTitle()}</h3>
            {isStartNode && (
              <Badge variant="secondary" className="text-xs px-1 py-0 bg-green-200 text-green-800">
                START
              </Badge>
            )}
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
        {renderWarning()}
        {renderContent()}
        {renderOptions()}
        {renderMedia()}
        {renderTechnicalInfo()}

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
