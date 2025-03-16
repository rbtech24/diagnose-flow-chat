
import { Button } from '../ui/button';
import { Save } from 'lucide-react';
import { SavedWorkflow } from '@/utils/flow/types';

interface QuickSaveButtonProps {
  currentWorkflow?: SavedWorkflow;
  onQuickSave: () => void;
}

export function QuickSaveButton({ onQuickSave }: QuickSaveButtonProps) {
  return (
    <Button
      variant="default"
      size="sm"
      onClick={onQuickSave}
      className="flex items-center gap-2"
    >
      <Save className="w-4 h-4" />
      Save
    </Button>
  );
}
