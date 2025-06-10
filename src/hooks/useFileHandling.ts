
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

interface WorkflowValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
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

  // Enhanced workflow validation
  const validateWorkflow = useCallback((data: any): WorkflowValidationResult => {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Basic structure validation
    if (!data || typeof data !== 'object') {
      errors.push('Invalid file format: Must be a valid JSON object');
      return { isValid: false, errors, warnings };
    }

    // Check for required fields
    if (!data.nodes || !Array.isArray(data.nodes)) {
      errors.push('Invalid workflow: Missing or invalid nodes array');
    }

    if (!data.edges || !Array.isArray(data.edges)) {
      errors.push('Invalid workflow: Missing or invalid edges array');
    }

    if (typeof data.nodeCounter !== 'number') {
      warnings.push('Missing node counter, will be auto-generated');
    }

    // Validate nodes structure
    if (data.nodes && Array.isArray(data.nodes)) {
      data.nodes.forEach((node: any, index: number) => {
        if (!node.id) {
          errors.push(`Node at index ${index}: Missing required 'id' field`);
        }
        if (!node.type) {
          warnings.push(`Node at index ${index}: Missing 'type' field`);
        }
        if (!node.position || typeof node.position.x !== 'number' || typeof node.position.y !== 'number') {
          errors.push(`Node at index ${index}: Invalid or missing position coordinates`);
        }
        if (!node.data) {
          warnings.push(`Node at index ${index}: Missing 'data' field`);
        }
      });
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }, []);

  // Enhanced save function - now shows success popup and stays in workflow
  const handleSave = useCallback(async (name: string, folder: string, appliance: string) => {
    try {
      console.log('Saving workflow with:', {name, folder, appliance, nodes, edges});
      
      const workflow = await handleSaveWorkflow(nodes, edges, nodeCounter, name, folder, appliance, '');
      
      if (workflow) {
        // Show prominent success popup
        toast({
          title: "✅ Workflow Saved Successfully!",
          description: `"${name}" has been saved to the "${folder}" folder. You can continue editing or navigate away when ready.`,
          duration: 5000,
        });
      }
      return Promise.resolve();
    } catch (error) {
      console.error('Save error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      toast({
        title: "Save Failed",
        description: `Failed to save the workflow: ${errorMessage}. Please try again.`,
        variant: "destructive"
      });
      return Promise.reject(error);
    }
  }, [nodes, edges, nodeCounter]);

  // Enhanced file import with comprehensive validation
  const handleFileImport = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // File type validation
    if (!file.name.toLowerCase().endsWith('.json')) {
      toast({
        title: "Invalid File Type",
        description: "Please select a valid JSON workflow file",
        variant: "destructive"
      });
      event.target.value = '';
      return;
    }

    // File size validation (10MB limit)
    const maxFileSize = 10 * 1024 * 1024;
    if (file.size > maxFileSize) {
      toast({
        title: "File Too Large",
        description: "Workflow file must be smaller than 10MB",
        variant: "destructive"
      });
      event.target.value = '';
      return;
    }

    setIsLoading(true);
    
    try {
      // Read and parse file content for validation
      const fileContent = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target?.result as string);
        reader.onerror = () => reject(new Error('Failed to read file'));
        reader.readAsText(file);
      });

      let parsedData;
      try {
        parsedData = JSON.parse(fileContent);
      } catch (parseError) {
        throw new Error('Invalid JSON format');
      }

      // Validate workflow structure
      const validation = validateWorkflow(parsedData);
      
      if (!validation.isValid) {
        toast({
          title: "Invalid Workflow File",
          description: `Validation errors: ${validation.errors.join(', ')}`,
          variant: "destructive"
        });
        return;
      }

      // Show warnings if any
      if (validation.warnings.length > 0) {
        toast({
          title: "Import Warnings",
          description: `${validation.warnings.join(', ')}`,
          variant: "default"
        });
      }

      await handleImportWorkflow(file, setNodes, setEdges, setNodeCounter);

      const newState = { nodes, edges, nodeCounter };
      setHistory(addToHistory(history, newState));

      toast({
        title: "Workflow Imported",
        description: "Workflow has been successfully imported and validated",
      });

    } catch (error) {
      console.error('Import error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      toast({
        title: "Import Failed",
        description: `Failed to import workflow: ${errorMessage}`,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
      event.target.value = '';
    }
  }, [nodes, edges, nodeCounter, setNodes, setEdges, setNodeCounter, setIsLoading, history, setHistory, validateWorkflow]);

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
    validateWorkflow,
  };
}
