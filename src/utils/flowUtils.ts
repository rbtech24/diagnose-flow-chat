
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

export const getFolders = (): string[] => {
  const workflows = getAllWorkflows();
  const folderSet = new Set<string>();
  
  workflows.forEach(workflow => {
    if (workflow.metadata.folder && workflow.nodes.length > 0) {
      folderSet.add(workflow.metadata.folder);
    }
  });
  
  return Array.from(folderSet).sort();
};

export const getAllWorkflows = (): SavedWorkflow[] => {
  const storedWorkflows = localStorage.getItem('diagnostic-workflows');
  const workflows = storedWorkflows ? JSON.parse(storedWorkflows) : [];
  return workflows.filter(w => w.nodes.length > 0); // Only return workflows that have nodes
};

export const getWorkflowsInFolder = (folder: string): SavedWorkflow[] => {
  const workflows = getAllWorkflows();
  return workflows.filter(w => w.metadata.folder === folder);
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
  const workflows = getAllWorkflows();
  
  const newWorkflow: SavedWorkflow = {
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

  // Check if workflow with same name and folder exists
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
  } else {
    workflows.push(newWorkflow);
  }

  localStorage.setItem('diagnostic-workflows', JSON.stringify(workflows));
  toast({
    title: "Workflow Saved",
    description: `Saved "${name}" to ${appliance ? 'appliance' : 'folder'} "${folder}"`
  });
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
