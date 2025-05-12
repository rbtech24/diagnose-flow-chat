
import { useCallback } from 'react';
import { toast } from '@/hooks/use-toast';
import { handleSaveWorkflow, handleImportWorkflow } from '@/utils/flow';
import { addToHistory } from '@/utils/workflowHistory';
import { Node } from '@xyflow/react';

interface UseFileHandlingProps {
  nodes: Node[];
  edges: any[];
  nodeCounter: number;
  setNodes: (nodes: Node[]) => void;
  setEdges: (edges: any[]) => void;
  setNodeCounter: (counter: number) => void;
  setIsLoading: (loading: boolean) => void;
  history: any;
  setHistory: (history: any) => void;
}

export function useFileHandling({
  nodes,
  edges,
  nodeCounter,
  setNodes,
  setEdges,
  setNodeCounter,
  setIsLoading,
  history,
  setHistory,
}: UseFileHandlingProps) {
  const handleSave = useCallback(async (name: string, folder: string, appliance: string) => {
    try {
      console.log('Saving workflow with:', {name, folder, appliance, nodes, edges});
      const workflow = await handleSaveWorkflow(nodes, edges, nodeCounter, name, folder, appliance, '');
      if (workflow) {
        toast({
          title: "Workflow Saved",
          description: `Successfully saved "${name}" to folder "${folder}"`
        });
      }
      return Promise.resolve();
    } catch (error) {
      console.error('Save error:', error);
      toast({
        title: "Save Failed",
        description: "Failed to save the workflow. Please try again.",
        variant: "destructive"
      });
      return Promise.reject(error);
    }
  }, [nodes, edges, nodeCounter]);

  const handleFileImport = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setIsLoading(true);
      try {
        await handleImportWorkflow(file, setNodes, setEdges, setNodeCounter);
        const newState = { nodes, edges, nodeCounter };
        setHistory(addToHistory(history, newState));
      } finally {
        setIsLoading(false);
        event.target.value = '';
      }
    }
  }, [nodes, edges, nodeCounter, setNodes, setEdges, setNodeCounter, setIsLoading, history, setHistory]);

  const handleFileInputClick = useCallback(() => {
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
  }, []);

  return {
    handleSave,
    handleFileImport,
    handleFileInputClick,
  };
}
