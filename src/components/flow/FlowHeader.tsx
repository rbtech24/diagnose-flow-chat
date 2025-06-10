
import { Button } from '@/components/ui/button';
import { QuickSaveButton } from './QuickSaveButton';
import { AutoSaveIndicator } from './AutoSaveIndicator';
import { SavedWorkflow } from '@/utils/flow/types';

interface AutoSaveState {
  isAutoSaving: boolean;
  lastSavedAt: Date | null;
  hasUnsavedChanges: boolean;
}

interface FlowHeaderProps {
  currentWorkflow?: SavedWorkflow;
  onQuickSave: () => void;
  autoSaveState: AutoSaveState;
}

export function FlowHeader({
  currentWorkflow,
  onQuickSave,
  autoSaveState
}: FlowHeaderProps) {
  return (
    <div className="absolute top-2 left-2 z-20 flex items-center gap-3 bg-background/80 backdrop-blur-sm rounded-lg p-2 border shadow-sm">
      {currentWorkflow && (
        <>
          <div className="text-sm font-medium text-foreground">
            {currentWorkflow.metadata.name}
          </div>
          <div className="text-xs text-muted-foreground">
            {currentWorkflow.metadata.folder}
          </div>
          <QuickSaveButton
            onQuickSave={onQuickSave}
            currentWorkflow={currentWorkflow}
          />
          <AutoSaveIndicator
            isAutoSaving={autoSaveState.isAutoSaving}
            lastSavedAt={autoSaveState.lastSavedAt}
            hasUnsavedChanges={autoSaveState.hasUnsavedChanges}
          />
        </>
      )}
    </div>
  );
}
