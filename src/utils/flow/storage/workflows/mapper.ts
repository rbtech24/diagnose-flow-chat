
import { SavedWorkflow } from '../../types';
import { WorkflowQueryResult } from './types';

export const mapWorkflowFromDB = (workflow: WorkflowQueryResult): SavedWorkflow => {
  const flowData = workflow.flow_data;
  return {
    metadata: {
      name: workflow.name,
      folder: workflow.workflow_categories?.name || 'Default',
      appliance: workflow.workflow_categories?.name || 'Default',
      createdAt: workflow.created_at,
      updatedAt: workflow.updated_at,
      isActive: workflow.is_active
    },
    nodes: flowData?.nodes || [],
    edges: flowData?.edges || [],
    nodeCounter: flowData?.nodeCounter || 0
  };
};
