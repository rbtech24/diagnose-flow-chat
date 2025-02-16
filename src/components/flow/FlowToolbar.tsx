
import { Button } from '../ui/button';
import { SaveWorkflowDialog } from './SaveWorkflowDialog';
import { handleSaveWorkflow } from '@/utils/flowUtils';
import { Download, Upload } from 'lucide-react';
import { useFlowState } from '@/hooks/useFlowState';
import { useCallback } from 'react';

export function FlowToolbar() {
  const { nodes, edges, nodeCounter } = useFlowState();

  const handleImport = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    handleSaveWorkflow(nodes, edges, nodeCounter, file.name, 'import');
  }, [nodes, edges, nodeCounter]);

  const onSave = (name: string, folder: string) => {
    handleSaveWorkflow(nodes, edges, nodeCounter, name, folder);
  };

  return (
    <div className="absolute top-4 right-4 flex items-center gap-2">
      <SaveWorkflowDialog onSave={onSave} />
      <Button variant="secondary" className="flex items-center gap-2" onClick={() => {
        handleSaveWorkflow(nodes, edges, nodeCounter, 'Exported Workflow', 'export');
      }}>
        <Download className="w-4 h-4" />
        Export
      </Button>
      <Button variant="secondary" className="flex items-center gap-2" onClick={() => {
        document.getElementById('import-workflow')?.click();
      }}>
        <Upload className="w-4 h-4" />
        Import
      </Button>
      <input
        type="file"
        id="import-workflow"
        className="hidden"
        accept=".json"
        onChange={handleImport}
      />
    </div>
  );
}
