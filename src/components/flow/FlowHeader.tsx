
import { QuickSaveButton } from './QuickSaveButton';
import { WorkflowActions } from './WorkflowActions';
import { SavedWorkflow } from '@/utils/flow';

interface FlowHeaderProps {
  currentWorkflow?: SavedWorkflow;
  onQuickSave: () => void;
}

export function FlowHeader({ currentWorkflow, onQuickSave }: FlowHeaderProps) {
  return (
    <div className="absolute top-4 right-4 z-50 flex gap-2">
      <QuickSaveButton 
        currentWorkflow={currentWorkflow}
        onQuickSave={onQuickSave}
      />
      <WorkflowActions />
    </div>
  );
}
