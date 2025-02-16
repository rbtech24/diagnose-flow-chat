
import { Button } from '../ui/button';
import { PlusCircle, Upload } from 'lucide-react';
import { Panel } from '@xyflow/react';
import { SaveWorkflowDialog } from './SaveWorkflowDialog';

interface FlowToolbarProps {
  onAddNode: () => void;
  onSave: (name: string, folder: string) => void;
  onImportClick: () => void;
}

export default function FlowToolbar({ onAddNode, onSave, onImportClick }: FlowToolbarProps) {
  return (
    <Panel position="top-left" className="bg-white p-2 rounded-lg shadow-sm flex gap-2">
      <Button onClick={onAddNode} className="flex items-center gap-2">
        <PlusCircle className="w-4 h-4" />
        Add Step
      </Button>
      <SaveWorkflowDialog onSave={onSave} />
      <Button 
        onClick={onImportClick}
        variant="secondary" 
        className="flex items-center gap-2"
      >
        <Upload className="w-4 h-4" />
        Import
      </Button>
    </Panel>
  );
}
