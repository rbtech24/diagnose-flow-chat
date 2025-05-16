
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { DiagnosticSelector } from "@/components/diagnostics/DiagnosticSelector";
import { DiagnosticSteps } from "@/components/diagnostics/DiagnosticSteps";
import { useWorkflows } from "@/hooks/useWorkflows";
import { useUserRole } from "@/hooks/useUserRole";
import { SavedWorkflow } from '@/utils/flow/types';

export default function DiagnosticsPage() {
  const navigate = useNavigate();
  const { workflows, folders } = useWorkflows();
  const { userRole } = useUserRole();
  const [selectedWorkflow, setSelectedWorkflow] = useState<SavedWorkflow | null>(null);
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  
  // Only show active workflows
  const activeWorkflows = workflows.filter(w => w.metadata.isActive !== false);

  // Get workflows for the selected folder
  const folderWorkflows = selectedFolder 
    ? activeWorkflows.filter(w => w.metadata.folder === selectedFolder || w.metadata.appliance === selectedFolder)
    : [];

  // For debug purposes, log the data
  useEffect(() => {
    console.log("DiagnosticsPage - All workflows:", workflows);
    console.log("DiagnosticsPage - Active workflows:", activeWorkflows);
    console.log("DiagnosticsPage - Available folders:", folders);
    console.log("DiagnosticsPage - Selected folder:", selectedFolder);
    if (selectedFolder) {
      console.log("DiagnosticsPage - Workflows in selected folder:", folderWorkflows);
    }
  }, [workflows, activeWorkflows, folders, selectedFolder, folderWorkflows]);

  const handleBackToDashboard = () => {
    if (userRole === 'company') {
      navigate('/company');
    } else if (userRole === 'tech') {
      navigate('/tech');
    } else {
      navigate('/admin');
    }
  };

  const handleSelectWorkflow = (workflow: SavedWorkflow) => {
    setSelectedWorkflow(workflow);
  };

  const handleSelectFolder = (folder: string) => {
    setSelectedFolder(folder);
    setSelectedWorkflow(null);
  };

  const handleBackToFolders = () => {
    setSelectedFolder(null);
    setSelectedWorkflow(null);
  };

  const getWorkflowId = (workflow: SavedWorkflow) => 
    `${workflow.metadata.folder || workflow.metadata.appliance || 'General'}-${workflow.metadata.name}`;

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-4">
        <Button 
          variant="outline" 
          size="sm" 
          className="flex items-center text-slate-600 hover:text-slate-900"
          onClick={handleBackToDashboard}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>
      </div>

      <div>
        <h1 className="text-2xl font-bold mb-2">Diagnostic Procedures</h1>
        <p className="text-muted-foreground mb-6">
          Follow step-by-step diagnostic procedures to troubleshoot and repair appliances
        </p>

        {selectedWorkflow ? (
          <div>
            <div className="mb-4">
              <Button 
                variant="outline" 
                onClick={() => setSelectedWorkflow(null)}
              >
                Back to Diagnostics List
              </Button>
            </div>
            <DiagnosticSteps workflow={selectedWorkflow} />
          </div>
        ) : selectedFolder ? (
          <div>
            <div className="mb-4">
              <Button 
                variant="outline" 
                onClick={handleBackToFolders}
              >
                Back to Appliance Categories
              </Button>
            </div>
            <DiagnosticSelector 
              workflows={folderWorkflows} 
              onSelect={handleSelectWorkflow}
              selectedWorkflowId={selectedWorkflow ? getWorkflowId(selectedWorkflow) : undefined}
              title={`${selectedFolder} Diagnostics`}
              showFolders={false}
            />
          </div>
        ) : (
          <DiagnosticSelector 
            folders={folders}
            workflows={activeWorkflows} // Pass all active workflows here to correctly count them
            onSelectFolder={handleSelectFolder}
            title="Appliance Categories"
            showFolders={true}
          />
        )}
      </div>
    </div>
  );
}
