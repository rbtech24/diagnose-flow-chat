
import { Appliance } from './appliance';
import { SavedWorkflow } from '@/utils/flow/types';

// Strict interfaces for WorkflowView props
export interface WorkflowViewHandlers {
  onEdit?: (index: number, name: string) => void;
  onDelete?: (index: number) => void;
  onToggleWorkflow?: (applianceIndex: number, symptomIndex: number) => void;
  onMoveSymptom?: (applianceIndex: number, fromIndex: number, toIndex: number) => void;
  onMoveAppliance?: (fromIndex: number, toIndex: number) => void;
  onOpenWorkflowEditor?: (applianceName: string, symptomName?: string) => void;
  onAddIssue?: (applianceName: string) => void;
  onDeleteWorkflow?: (workflow: SavedWorkflow) => void;
  onMoveWorkflow?: (fromIndex: number, toIndex: number) => void;
  onToggleWorkflowActive?: (workflow: SavedWorkflow) => void;
  onMoveWorkflowToFolder?: (workflow: SavedWorkflow, targetFolder: string) => Promise<boolean>;
}

export interface WorkflowViewConfiguration {
  isReadOnly?: boolean;
  workflowsByFolder?: Record<string, SavedWorkflow[]>;
  enableFolderView?: boolean;
  enableDragDrop?: boolean;
}

export interface WorkflowViewData {
  filteredAppliances: Appliance[];
  workflows: SavedWorkflow[];
  isReordering: boolean;
  selectedFolder: string;
}

export interface WorkflowViewProps extends WorkflowViewData, WorkflowViewHandlers, WorkflowViewConfiguration {}

// Color scheme interface
export interface ColorScheme {
  background: string;
  border: string;
}

export type SymptomCardColorFunction = (index: number) => string;
