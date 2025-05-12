
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
  dbId?: string; // Added this to store the Supabase ID
}

export interface SavedWorkflow {
  metadata: WorkflowMetadata;
  nodes: Node[];
  edges: Edge[];
  nodeCounter: number;
}

export interface WorkflowData {
  name: string;
  category_id: string;
  description?: string;
  flow_data: {
    metadata: WorkflowMetadata;
    nodes: Node[];
    edges: Edge[];
    nodeCounter: number;
  };
  is_active: boolean;
  updated_at?: string;
}

export interface NodeUpdateFunction {
  (nodeId: string, newData: any): void;
}

export interface FlowHistoryState {
  nodes: Node[];
  edges: Edge[];
  nodeCounter: number;
}
