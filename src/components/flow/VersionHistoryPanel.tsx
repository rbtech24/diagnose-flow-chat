
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  History, 
  RotateCcw, 
  Trash2, 
  Clock, 
  User, 
  GitBranch,
  Download
} from 'lucide-react';
import { WorkflowVersion } from '@/hooks/useVersionHistory';
import { formatDistanceToNow } from 'date-fns';

interface VersionHistoryPanelProps {
  versions: WorkflowVersion[];
  onRestoreVersion: (version: WorkflowVersion) => void;
  onRemoveVersion: (versionId: string) => void;
  onClearHistory: () => void;
  className?: string;
}

export function VersionHistoryPanel({
  versions,
  onRestoreVersion,
  onRemoveVersion,
  onClearHistory,
  className
}: VersionHistoryPanelProps) {
  const [selectedVersion, setSelectedVersion] = useState<string | null>(null);

  const handleRestore = (version: WorkflowVersion) => {
    if (confirm(`Are you sure you want to restore to "${version.description}"? This will replace your current workflow.`)) {
      onRestoreVersion(version);
    }
  };

  const handleRemove = (versionId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this version?')) {
      onRemoveVersion(versionId);
    }
  };

  const handleClearAll = () => {
    if (confirm('Are you sure you want to clear all version history? This action cannot be undone.')) {
      onClearHistory();
    }
  };

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <History className="w-4 h-4" />
            Version History
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              {versions.length} versions
            </Badge>
            {versions.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearAll}
                className="h-6 px-2 text-xs"
              >
                <Trash2 className="w-3 h-3" />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        {versions.length === 0 ? (
          <div className="p-4 text-center text-sm text-muted-foreground">
            <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
            No version history yet
            <p className="text-xs mt-1">
              Versions will be created automatically as you work
            </p>
          </div>
        ) : (
          <ScrollArea className="h-80">
            <div className="p-2 space-y-1">
              {versions.map((version, index) => (
                <div
                  key={version.id}
                  className={`p-3 rounded-lg border cursor-pointer transition-colors hover:bg-muted/50 ${
                    selectedVersion === version.id ? 'bg-muted border-primary' : ''
                  }`}
                  onClick={() => setSelectedVersion(
                    selectedVersion === version.id ? null : version.id
                  )}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <GitBranch className="w-3 h-3 text-muted-foreground" />
                        <span className="text-xs font-medium truncate">
                          {version.description}
                        </span>
                        {version.isAutoSave && (
                          <Badge variant="outline" className="text-xs px-1 py-0">
                            Auto
                          </Badge>
                        )}
                        {index === 0 && (
                          <Badge variant="default" className="text-xs px-1 py-0">
                            Latest
                          </Badge>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatDistanceToNow(version.timestamp, { addSuffix: true })}
                        </span>
                        <span>{version.nodes.length} nodes</span>
                        <span>{version.edges.length} edges</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRestore(version);
                        }}
                        className="h-6 px-2"
                        title="Restore this version"
                      >
                        <RotateCcw className="w-3 h-3" />
                      </Button>
                      
                      {index > 0 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => handleRemove(version.id, e)}
                          className="h-6 px-2 text-destructive hover:text-destructive"
                          title="Delete this version"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      )}
                    </div>
                  </div>

                  {selectedVersion === version.id && (
                    <div className="mt-2 pt-2 border-t">
                      <div className="text-xs text-muted-foreground space-y-1">
                        <div>Created: {version.timestamp.toLocaleString()}</div>
                        <div>Node Counter: {version.nodeCounter}</div>
                        {!version.isAutoSave && (
                          <div className="flex items-center gap-1 text-primary">
                            <User className="w-3 h-3" />
                            Manual save
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}
