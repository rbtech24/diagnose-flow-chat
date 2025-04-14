
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { FlowEditorContent } from "@/components/flow/FlowEditorContent";
import { useFlowState } from "@/hooks/useFlowState";
import { useUserRole } from "@/hooks/useUserRole";
import { useToast } from "@/hooks/use-toast";

export default function WorkflowEditor() {
  const location = useLocation();
  const [applianceName, setApplianceName] = useState<string | null>(null);
  const [symptomName, setSymptomName] = useState<string | null>(null);
  const { role } = useUserRole();
  const flowState = useFlowState();
  const { toast } = useToast();

  useEffect(() => {
    // Extract query parameters from the URL
    const params = new URLSearchParams(location.search);
    const appliance = params.get("appliance");
    const symptom = params.get("symptom");
    
    if (appliance) {
      setApplianceName(appliance);
    }
    
    if (symptom) {
      setSymptomName(symptom);
    }

    // Check access to this workflow
    flowState.checkWorkflowAccess({ role });
  }, [location, role, flowState]);

  // Pass the props correctly matching FlowEditorContent's expected props
  return (
    <FlowEditorContent 
      nodes={flowState.nodes}
      edges={flowState.edges}
      isLoading={flowState.isLoading}
      snapToGrid={flowState.snapToGrid}
      onNodesChange={flowState.onNodesChange}
      onEdgesChange={flowState.onEdgesChange}
      onConnect={() => {}}
      onNodeClick={() => {}}
      onQuickSave={() => {}}
      onAddNode={() => {}}
      onSave={() => Promise.resolve()}
      onFileImport={() => {}}
      onFileInputClick={() => {}}
      onCopySelected={() => {}}
      onPaste={() => {}}
      appliances={applianceName ? [applianceName] : []}
    />
  );
}
