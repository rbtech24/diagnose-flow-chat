
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { FlowEditorContent } from "@/components/flow/FlowEditorContent";
import { useFlowState } from "@/hooks/useFlowState";
import { useUserRole } from "@/hooks/useUserRole";

export default function WorkflowEditor() {
  const location = useLocation();
  const [applianceName, setApplianceName] = useState<string | null>(null);
  const [symptomName, setSymptomName] = useState<string | null>(null);
  const { role } = useUserRole();
  const { checkWorkflowAccess } = useFlowState();

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
    checkWorkflowAccess({ role });
  }, [location, role, checkWorkflowAccess]);

  return (
    <FlowEditorContent 
      applianceName={applianceName} 
      symptomName={symptomName}
    />
  );
}
