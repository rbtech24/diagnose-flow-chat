
import { Node, Edge } from '@xyflow/react';

export type NodeType = 'question' | 'symptom' | 'measurement' | 'solution' | 'test';

export interface WorkflowMetadata {
  name: string;
  folder: string;
  createdAt: string;
  updatedAt: string;
  appliance?: string;
  symptom?: string;
  version?: string;
  tags?: string[];
  description?: string;
  isActive?: boolean;
}

export interface SavedWorkflow {
  metadata: WorkflowMetadata;
  nodes: Node[];
  edges: Edge[];
  nodeCounter: number;
}

export interface NodeUpdateFunction {
  (nodeId: string, newData: any): void;
}

export interface FlowHistoryState {
  nodes: Node[];
  edges: Edge[];
  nodeCounter: number;
}
