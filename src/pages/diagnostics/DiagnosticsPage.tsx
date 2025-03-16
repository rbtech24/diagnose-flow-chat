
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { DiagnosticSelector } from "@/components/diagnostics/DiagnosticSelector";
import { DiagnosticSteps } from "@/components/diagnostics/DiagnosticSteps";
import { useWorkflows } from "@/hooks/useWorkflows";
import { useUserRole } from "@/hooks/useUserRole";
import { SavedWorkflow } from '@/utils/flow/types';
import { useAuth } from "@/context/AuthContext";
import { toast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function DiagnosticsPage() {
  const navigate = useNavigate();
  const { workflows } = useWorkflows();
  const { userRole } = useUserRole();
  const { checkWorkflowAccess, workflowUsageStats } = useAuth();
  const [selectedWorkflow, setSelectedWorkflow] = useState<SavedWorkflow | null>(null);
  const [usageStats, setUsageStats] = useState<any>(null);
  
  // Only show active workflows
  const activeWorkflows = workflows.filter(w => w.metadata.isActive);

  useEffect(() => {
    // Load usage statistics when component mounts
    setUsageStats(workflowUsageStats());
  }, [workflowUsageStats]);

  const handleBackToDashboard = () => {
    if (userRole === 'company') {
      navigate('/company');
    } else {
      navigate('/tech');
    }
  };

  const handleSelectWorkflow = (workflow: SavedWorkflow) => {
    const workflowId = getWorkflowId(workflow);
    const accessStatus = checkWorkflowAccess(workflowId);
    
    if (accessStatus.hasAccess) {
      setSelectedWorkflow(workflow);
      
      // Refresh usage stats after accessing a workflow
      setUsageStats(workflowUsageStats());
    } else {
      toast({
        title: "Access Denied",
        description: accessStatus.message || "You don't have permission to access this workflow.",
        variant: "destructive",
      });
    }
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

        {/* Usage Statistics Card */}
        {usageStats && userRole !== 'admin' && (
          <Card className="mb-6">
            <CardContent className="pt-6">
              <h2 className="text-lg font-semibold mb-2">Workflow Usage</h2>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center">
                  <Badge variant="outline" className="mr-2">Today</Badge>
                  <span>{usageStats.today} workflows</span>
                </div>
                <div className="flex items-center">
                  <Badge variant="outline" className="mr-2">This Week</Badge>
                  <span>{usageStats.weekly} workflows</span>
                </div>
                <div className="flex items-center">
                  <Badge variant="outline" className="mr-2">This Month</Badge>
                  <span>{usageStats.monthly} workflows</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

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
