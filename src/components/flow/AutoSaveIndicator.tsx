
import { memo } from 'react';
import { Badge } from '@/components/ui/badge';
import { Save, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AutoSaveIndicatorProps {
  isAutoSaving: boolean;
  lastSavedAt: Date | null;
  hasUnsavedChanges: boolean;
  className?: string;
}

export const AutoSaveIndicator = memo(({
  isAutoSaving,
  lastSavedAt,
  hasUnsavedChanges,
  className
}: AutoSaveIndicatorProps) => {
  const getDisplayText = () => {
    if (isAutoSaving) {
      return 'Saving...';
    }
    
    if (hasUnsavedChanges) {
      return 'Unsaved changes';
    }
    
    if (lastSavedAt) {
      const now = new Date();
      const diffMs = now.getTime() - lastSavedAt.getTime();
      const diffSeconds = Math.floor(diffMs / 1000);
      const diffMinutes = Math.floor(diffSeconds / 60);
      
      if (diffSeconds < 60) {
        return 'Saved just now';
      } else if (diffMinutes < 60) {
        return `Saved ${diffMinutes}m ago`;
      } else {
        return `Saved at ${lastSavedAt.toLocaleTimeString([], { 
          hour: '2-digit', 
          minute: '2-digit' 
        })}`;
      }
    }
    
    return 'Not saved';
  };

  const getIcon = () => {
    if (isAutoSaving) {
      return <Save className="w-3 h-3 animate-pulse" />;
    }
    
    if (hasUnsavedChanges) {
      return <AlertCircle className="w-3 h-3" />;
    }
    
    if (lastSavedAt) {
      return <CheckCircle className="w-3 h-3" />;
    }
    
    return <Clock className="w-3 h-3" />;
  };

  const getVariant = () => {
    if (isAutoSaving) {
      return 'secondary';
    }
    
    if (hasUnsavedChanges) {
      return 'destructive';
    }
    
    if (lastSavedAt) {
      return 'default';
    }
    
    return 'outline';
  };

  return (
    <Badge 
      variant={getVariant()} 
      className={cn(
        'flex items-center gap-1 text-xs font-normal',
        isAutoSaving && 'animate-pulse',
        className
      )}
    >
      {getIcon()}
      {getDisplayText()}
    </Badge>
  );
});

AutoSaveIndicator.displayName = 'AutoSaveIndicator';
