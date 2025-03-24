
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useUserRole } from "@/hooks/useUserRole";
import { Navigate } from "react-router-dom";
import { Stethoscope, Wrench, ArrowRight } from "lucide-react";
import { useWorkflows } from "@/hooks/useWorkflows";
import { SavedWorkflow } from "@/utils/flow/types";

export default function TechDiagnostics() {
  const { role, isLoading: roleLoading } = useUserRole();
  const { workflows, isLoading: workflowsLoading } = useWorkflows();
  const [selectedWorkflow, setSelectedWorkflow] = useState<string | null>(null);
  const navigate = useNavigate();
  
  // Check if user is authorized to access this page
  if (!roleLoading && role !== 'tech' && role !== 'admin') {
    return <Navigate to="/login" />;
  }
  
  if (roleLoading || workflowsLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Generate a unique ID for each workflow
  const getWorkflowId = (workflow: SavedWorkflow) => 
    `${workflow.metadata.folder}-${workflow.metadata.name}`;

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Diagnostic Tools</h1>
          <p className="text-gray-500">Select a diagnostic procedure to start</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {workflows.length > 0 ? (
          workflows.map((workflow) => (
            <Card 
              key={getWorkflowId(workflow)} 
              className={`cursor-pointer transition-all hover:shadow-md ${
                selectedWorkflow === getWorkflowId(workflow) ? 'border-blue-500 ring-2 ring-blue-200' : ''
              }`}
              onClick={() => setSelectedWorkflow(getWorkflowId(workflow))}
            >
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{workflow.metadata.name}</CardTitle>
                    <CardDescription>{workflow.metadata.description || 'Diagnostic procedure'}</CardDescription>
                  </div>
                  <div className="bg-blue-100 p-2 rounded-full">
                    <Stethoscope className="h-5 w-5 text-blue-600" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="mt-2">
                  <p className="text-sm text-gray-600">
                    {workflow.nodeCounter || 0} steps • {workflow.metadata.folder || 'General'}
                  </p>
                  <Button 
                    className="w-full mt-4"
                    onClick={(e) => {
                      e.stopPropagation();
                      // In a real app, navigate to the workflow
                      console.log(`Starting workflow: ${getWorkflowId(workflow)}`);
                    }}
                  >
                    Start Diagnosis <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-full text-center py-12 border rounded-lg">
            <Wrench className="h-10 w-10 text-blue-500 mx-auto mb-3" />
            <h3 className="text-lg font-medium mb-1">No Diagnostic Procedures</h3>
            <p className="text-gray-500 mb-4">There are no diagnostic procedures available yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
