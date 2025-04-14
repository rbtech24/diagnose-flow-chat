
import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useFlowState } from "@/hooks/useFlowState";
import { FlowEditorContent } from "@/components/flow/FlowEditorContent";
import { useToast } from "@/hooks/use-toast";
import { useUserRole } from "@/hooks/useUserRole";

export default function WorkflowEditor() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const folder = searchParams.get("folder") || "";
  const name = searchParams.get("name") || "";
  const { toast } = useToast();
  const { role } = useUserRole();
  const { 
    nodes, 
    edges, 
    isLoading, 
    snapToGrid, 
    onNodesChange, 
    onEdgesChange, 
    onConnect,
    checkWorkflowAccess 
  } = useFlowState();

  useEffect(() => {
    // Prevent access if the user doesn't have proper permissions
    if (!checkWorkflowAccess(role)) {
      toast({
        title: "Access denied",
        description: "You don't have permission to edit workflows.",
        type: "error",
        variant: "destructive",
      });
      navigate(role === "admin" ? "/admin" : role === "company" ? "/company" : "/tech");
    }
  }, [navigate, role, checkWorkflowAccess, toast]);

  if (!folder) {
    return <div>Error: Missing folder parameter</div>;
  }

  return (
    <div className="h-screen w-full overflow-hidden">
      <FlowEditorContent 
        nodes={nodes}
        edges={edges}
        isLoading={isLoading}
        snapToGrid={snapToGrid}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={() => {}}
        onQuickSave={() => {}}
        onAddNode={() => {}}
        onSave={async () => {}}
        onFileImport={() => {}}
        onFileInputClick={() => {}}
        onCopySelected={() => {}}
        onPaste={() => {}}
        appliances={[]}
      />
    </div>
  );
}
