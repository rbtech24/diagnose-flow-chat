
import { Button } from "@/components/ui/button";
import { QuickSaveButton } from "./QuickSaveButton";
import { SavedWorkflow } from "@/utils/flow/types";
import { ArrowLeft, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useUserRole } from "@/hooks/useUserRole";

interface FlowHeaderProps {
  currentWorkflow?: SavedWorkflow;
  onQuickSave: () => void;
}

export function FlowHeader({ currentWorkflow, onQuickSave }: FlowHeaderProps) {
  const navigate = useNavigate();
  const { userRole } = useUserRole();
  const isAdmin = userRole === 'admin';
  
  const handleBack = () => {
    // Navigate back to the appropriate workflows page
    const basePath = isAdmin ? '/admin/workflows' : '/workflows';
    navigate(basePath);
  };

  const handleCreateNew = () => {
    // Clear URL parameters for new workflow
    const basePath = isAdmin ? '/admin/workflow-editor' : '/workflow-editor';
    navigate(`${basePath}?new=true`);
  };

  return (
    <div className="absolute top-0 right-0 p-4 z-20 pointer-events-none">
      <div className="flex items-center justify-between w-full pointer-events-auto">
        <Button
          variant="outline" 
          size="sm"
          className="flex items-center text-slate-600 hover:text-slate-900 mr-auto"
          onClick={handleBack}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Workflows
        </Button>
        <div className="ml-4 flex items-center gap-2">
          {isAdmin && (
            <Button
              variant="default"
              size="sm"
              className="flex items-center"
              onClick={handleCreateNew}
            >
              <Plus className="mr-2 h-4 w-4" />
              New Workflow
            </Button>
          )}
          {currentWorkflow && (
            <QuickSaveButton onQuickSave={onQuickSave} currentWorkflow={currentWorkflow} />
          )}
        </div>
      </div>
    </div>
  );
}
