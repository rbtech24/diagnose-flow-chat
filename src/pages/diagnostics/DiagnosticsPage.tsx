
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { DiagnosticSelector } from "@/components/diagnostics/DiagnosticSelector";
import { DiagnosticSteps } from "@/components/diagnostics/DiagnosticSteps";
import { useWorkflows } from "@/hooks/useWorkflows";
import { useUserRole } from "@/hooks/useUserRole";
import { SavedWorkflow } from '@/utils/flow/types';

export function DiagnosticsPage() {
  const navigate = useNavigate();
  const { workflows } = useWorkflows();
  const { userRole } = useUserRole();
  const [selectedWorkflow, setSelectedWorkflow] = useState<SavedWorkflow | null>(null);
  
  // Only show active workflows
  const activeWorkflows = workflows.filter(w => w.metadata.isActive);

  const handleBackToDashboard = () => {
    if (userRole === 'company') {
      navigate('/company');
    } else {
      navigate('/tech');
    }
  };

  const handleSelectWorkflow = (workflow: SavedWorkflow) => {
    setSelectedWorkflow(workflow);
  };

  const getWorkflowId = (workflow: SavedWorkflow) => 
    `${workflow.metadata.folder}-${workflow.metadata.name}`;

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
        ) : (
          <DiagnosticSelector 
            workflows={activeWorkflows} 
            onSelect={handleSelectWorkflow}
            selectedWorkflowId={selectedWorkflow ? getWorkflowId(selectedWorkflow) : undefined}
          />
        )}
      </div>
    </div>
  );
}

export default DiagnosticsPage;
