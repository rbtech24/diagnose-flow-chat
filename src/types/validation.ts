
export interface ValidationRule {
  id: string;
  name: string;
  description: string;
  severity: 'error' | 'warning' | 'info';
  category: 'structure' | 'content' | 'logic' | 'accessibility';
}

export interface ValidationResult {
  ruleId: string;
  severity: 'error' | 'warning' | 'info';
  message: string;
  nodeId?: string;
  edgeId?: string;
  suggestion?: string;
  autoFixAvailable?: boolean;
}

export interface ValidationSummary {
  totalIssues: number;
  errors: number;
  warnings: number;
  infos: number;
  results: ValidationResult[];
  isValid: boolean;
}

export interface ValidationContext {
  nodes: any[];
  edges: any[];
  nodeCounter: number;
  workflowMetadata?: {
    name?: string;
    description?: string;
    appliance?: string;
  };
}
