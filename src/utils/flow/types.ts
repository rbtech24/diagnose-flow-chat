
import { Node, Edge } from '@xyflow/react';

export interface WorkflowMetadata {
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
