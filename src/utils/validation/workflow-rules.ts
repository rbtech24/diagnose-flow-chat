
import { ValidationRule } from '@/types/validation';

export const WORKFLOW_VALIDATION_RULES: ValidationRule[] = [
  // Structure Rules
  {
    id: 'start-node-required',
    name: 'Start Node Required',
    description: 'Workflow must have at least one start node',
    severity: 'error',
    category: 'structure'
  },
  {
    id: 'orphaned-nodes',
    name: 'Orphaned Nodes',
    description: 'All nodes should be connected to the workflow',
    severity: 'warning',
    category: 'structure'
  },
  {
    id: 'dead-end-paths',
    name: 'Dead End Paths',
    description: 'Question nodes should have outgoing connections',
    severity: 'warning',
    category: 'structure'
  },
  {
    id: 'circular-dependencies',
    name: 'Circular Dependencies',
    description: 'Workflow should not contain circular references',
    severity: 'error',
    category: 'logic'
  },
  {
    id: 'unreachable-nodes',
    name: 'Unreachable Nodes',
    description: 'All nodes should be reachable from start nodes',
    severity: 'warning',
    category: 'structure'
  },

  // Content Rules
  {
    id: 'empty-content',
    name: 'Empty Content',
    description: 'Nodes should have meaningful content',
    severity: 'warning',
    category: 'content'
  },
  {
    id: 'missing-labels',
    name: 'Missing Labels',
    description: 'All nodes should have descriptive labels',
    severity: 'warning',
    category: 'content'
  },
  {
    id: 'duplicate-labels',
    name: 'Duplicate Labels',
    description: 'Node labels should be unique for clarity',
    severity: 'info',
    category: 'content'
  },
  {
    id: 'question-without-options',
    name: 'Question Without Options',
    description: 'Question nodes should have response options',
    severity: 'error',
    category: 'content'
  },
  {
    id: 'technical-specs-incomplete',
    name: 'Incomplete Technical Specifications',
    description: 'Technical nodes should have complete specifications',
    severity: 'warning',
    category: 'content'
  },

  // Logic Rules
  {
    id: 'unbalanced-branches',
    name: 'Unbalanced Branches',
    description: 'Question nodes should have balanced yes/no paths',
    severity: 'info',
    category: 'logic'
  },
  {
    id: 'missing-solution-paths',
    name: 'Missing Solution Paths',
    description: 'All diagnostic paths should lead to solutions',
    severity: 'warning',
    category: 'logic'
  },
  {
    id: 'workflow-link-validation',
    name: 'Workflow Link Validation',
    description: 'Workflow links should reference valid workflows',
    severity: 'error',
    category: 'logic'
  },

  // Accessibility Rules
  {
    id: 'media-alt-text',
    name: 'Missing Alt Text',
    description: 'Images should have descriptive alt text',
    severity: 'warning',
    category: 'accessibility'
  },
  {
    id: 'readable-font-size',
    name: 'Readable Content',
    description: 'Content should be clear and readable',
    severity: 'info',
    category: 'accessibility'
  }
];
