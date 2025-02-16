import { Node, Edge, Connection, MarkerType } from '@xyflow/react';
import { toast } from '@/hooks/use-toast';

export const defaultEdgeOptions = {
  type: 'smoothstep',
  animated: true,
  markerEnd: {
    type: MarkerType.ArrowClosed,
    color: '#22c55e',
  },
  style: {
    strokeWidth: 2,
    stroke: '#22c55e',
  },
};

export const initialNodes: Node[] = [
  {
    id: 'start',
    type: 'diagnosis',
    position: { x: 250, y: 0 },
    data: { 
      label: 'Start Diagnosis [START]',
      type: 'symptom',
      content: 'Select the main symptom',
      options: ['Dryer No Heat', 'No Power', 'Loud Noise'],
      nodeId: 'START'
    }
  },
];

export const initialEdges: Edge[] = [];

interface WorkflowMetadata {
  name: string;
  folder: string;
  createdAt: string;
  updatedAt: string;
  appliance?: string;
  symptom?: string;
}

export interface SavedWorkflow {
  metadata: WorkflowMetadata;
  nodes: Node[];
  edges: Edge[];
  nodeCounter: number;
}

export const cleanupWorkflows = () => {
  const storedWorkflows = localStorage.getItem('diagnostic-workflows') || '[]';
  const workflows = JSON.parse(storedWorkflows);
  const cleanedWorkflows = workflows.filter(workflow => workflow.nodes.length > 0);
  localStorage.setItem('diagnostic-workflows', JSON.stringify(cleanedWorkflows));
  return cleanedWorkflows;
};

export const getFolders = (): string[] => {
  const workflows = cleanupWorkflows();
  const folderSet = new Set<string>();
  
  workflows.forEach(workflow => {
    if (workflow.metadata?.folder && workflow.nodes.length > 0) {
      folderSet.add(workflow.metadata.folder);
    }
  });
  
  return Array.from(folderSet).sort();
};

export const getAllWorkflows = (): SavedWorkflow[] => {
  return cleanupWorkflows();
};

export const getWorkflowsInFolder = (folder: string): SavedWorkflow[] => {
  const workflows = getAllWorkflows();
  const folderWorkflows = workflows.filter(w => w.metadata.folder === folder);
  console.log(`Workflows in folder ${folder}:`, folderWorkflows.length);
  return folderWorkflows;
};

export const handleQuickSave = (
  nodes: Node[],
  edges: Edge[],
  nodeCounter: number,
  currentWorkflow: SavedWorkflow
) => {
  if (!currentWorkflow?.metadata?.folder || !currentWorkflow?.metadata?.name) {
    toast({
      title: "Error",
      description: "No folder information available for quick save",
      variant: "destructive"
    });
    return;
  }

  handleSaveWorkflow(
    nodes,
    edges,
    nodeCounter,
    currentWorkflow.metadata.name,
    currentWorkflow.metadata.folder,
    currentWorkflow.metadata.appliance,
    currentWorkflow.metadata.symptom
  );
};

export const handleSaveWorkflow = (
  nodes: Node[], 
  edges: Edge[], 
  nodeCounter: number,
  name: string,
  folder: string,
  appliance?: string,
  symptom?: string
) => {
  console.log('Saving workflow:', { name, folder, nodeCount: nodes.length });
  
  if (!name || !folder) {
    toast({
      title: "Error",
      description: "Workflow name and folder are required",
      variant: "destructive"
    });
    return;
  }

  const workflows = getAllWorkflows();
  
  const newWorkflow = {
    metadata: {
      name,
      folder,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      appliance,
      symptom
    },
    nodes,
    edges,
    nodeCounter
  };

  const existingIndex = workflows.findIndex(
    w => w.metadata.name === name && w.metadata.folder === folder
  );

  if (existingIndex >= 0) {
    workflows[existingIndex] = {
      ...newWorkflow,
      metadata: {
        ...newWorkflow.metadata,
        createdAt: workflows[existingIndex].metadata.createdAt
      }
    };
    console.log('Updated existing workflow at index:', existingIndex);
    toast({
      title: "Workflow Updated",
      description: `Updated "${name}" in folder "${folder}"`
    });
  } else {
    workflows.push(newWorkflow);
    console.log('Added new workflow, total workflows:', workflows.length);
    toast({
      title: "Workflow Saved",
      description: `Saved "${name}" to folder "${folder}"`
    });
  }

  localStorage.setItem('diagnostic-workflows', JSON.stringify(workflows));
  return newWorkflow;
};

export const handleImportWorkflow = (
  file: File,
  setNodes: (nodes: Node[]) => void,
  setEdges: (edges: Edge[]) => void,
  setNodeCounter: (counter: number) => void
) => {
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const workflow = JSON.parse(e.target?.result as string);
      setNodes(workflow.nodes);
      setEdges(workflow.edges);
      setNodeCounter(workflow.nodeCounter || workflow.nodes.length + 1);
      toast({
        title: "Workflow Imported",
        description: "Your workflow has been imported successfully."
      });
    } catch (error) {
      toast({
        title: "Import Error",
        description: "Failed to import workflow. Please check the file format.",
        variant: "destructive"
      });
    }
  };
  reader.readAsText(file);
};
