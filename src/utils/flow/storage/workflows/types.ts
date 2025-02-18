
import { SavedWorkflow } from '../../types';

export interface WorkflowData {
  nodes: any[];
  edges: any[];
  nodeCounter: number;
}

export interface WorkflowQueryResult {
  name: string;
  workflow_categories: {
    name: string;
  } | null;
  created_at: string;
  updated_at: string;
  is_active: boolean;
  flow_data: WorkflowData;
}
