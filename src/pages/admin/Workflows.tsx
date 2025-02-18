
import { WorkflowView } from '@/components/workflow/WorkflowView';
import { WorkflowHeader } from '@/components/workflow/WorkflowHeader';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getFolders } from '@/utils/flow/storage/categories';
import { SavedWorkflow } from '@/utils/flow/types';
import { useWorkflows } from '@/hooks/useWorkflows';

export default function AdminWorkflows() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFolder, setSelectedFolder] = useState('');
  const [isReordering, setIsReordering] = useState(false);
  const { workflows, folders } = useWorkflows();

  const handleOpenWorkflowEditor = (folder: string, name?: string) => {
    const params = new URLSearchParams();
    if (folder) params.set('folder', folder);
    if (name) params.set('name', name);
    navigate(`/admin/workflow-editor?${params.toString()}`);
  };

  const handleMoveWorkflow = (fromIndex: number, toIndex: number) => {
    console.log('Moving workflow from', fromIndex, 'to', toIndex);
  };

  const handleDeleteWorkflow = (workflow: SavedWorkflow) => {
    console.log('Deleting workflow:', workflow);
  };

  const handleToggleWorkflowActive = (workflow: SavedWorkflow) => {
    console.log('Toggling workflow active state:', workflow);
  };

  const handleMoveWorkflowToFolder = (workflow: SavedWorkflow, targetFolder: string) => {
    console.log('Moving workflow to folder:', workflow, targetFolder);
  };

  return (
    <div className="p-4">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Workflow Management</h1>
        <p className="text-gray-600">Create and manage diagnostic workflows</p>
      </div>

      <WorkflowHeader
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedFolder={selectedFolder}
        onFolderChange={setSelectedFolder}
        folders={folders}
        isReordering={isReordering}
        onReorderingChange={setIsReordering}
        onAddAppliance={(name) => console.log('Adding appliance:', name)}
      />

      <div className="mt-6">
        <WorkflowView
          filteredAppliances={[]}
          workflows={workflows}
          isReordering={isReordering}
          selectedFolder={selectedFolder}
          onEdit={(index, name) => console.log('Editing:', index, name)}
          onDelete={(index) => console.log('Deleting:', index)}
          onToggleWorkflow={(applianceIndex, symptomIndex) => 
            console.log('Toggling workflow:', applianceIndex, symptomIndex)}
          onMoveSymptom={(applianceIndex, fromIndex, toIndex) => 
            console.log('Moving symptom:', applianceIndex, fromIndex, toIndex)}
          onMoveAppliance={(fromIndex, toIndex) => 
            console.log('Moving appliance:', fromIndex, toIndex)}
          onOpenWorkflowEditor={handleOpenWorkflowEditor}
          onAddIssue={(applianceName) => console.log('Adding issue:', applianceName)}
          onDeleteWorkflow={handleDeleteWorkflow}
          onMoveWorkflow={handleMoveWorkflow}
          onToggleWorkflowActive={handleToggleWorkflowActive}
          onMoveWorkflowToFolder={handleMoveWorkflowToFolder}
        />
      </div>
    </div>
  );
}
