
import { useHotkeys } from 'react-hotkeys-hook';
import { SavedWorkflow } from '@/utils/flow';

interface UseHotkeySetupProps {
  handleQuickSaveClick: () => void;
  handleCopySelected: () => void;
  handlePaste: () => void;
  currentWorkflow?: SavedWorkflow;
}

export function useHotkeySetup({
  handleQuickSaveClick,
  handleCopySelected,
  handlePaste,
  currentWorkflow,
}: UseHotkeySetupProps) {
  useHotkeys('ctrl+s', (e) => {
    e.preventDefault();
    if (currentWorkflow) {
      handleQuickSaveClick();
    }
  });

  useHotkeys('ctrl+c', (e) => {
    e.preventDefault();
    handleCopySelected();
  });

  useHotkeys('ctrl+v', (e) => {
    e.preventDefault();
    handlePaste();
  });
}
