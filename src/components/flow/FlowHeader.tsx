
import { Button } from "@/components/ui/button";
import { QuickSaveButton } from "./QuickSaveButton";
import { SavedWorkflow } from "@/utils/flow/types";
import { ArrowLeft } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useUserRole } from "@/hooks/useUserRole";

interface FlowHeaderProps {
  currentWorkflow?: SavedWorkflow;
  onQuickSave: () => void;
}

export function FlowHeader({ currentWorkflow, onQuickSave }: FlowHeaderProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { userRole } = useUserRole();
  
  const handleBack = () => {
    if (userRole === 'admin') {
      // If coming from admin workflows page, go back there
      if (location.key && window.history.length > 1) {
        navigate(-1);
      } else {
        navigate('/admin/workflows');
      }
    } else {
      // For non-admin users, go to the regular workflows page
      navigate('/workflows');
    }
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
          {currentWorkflow && (
            <QuickSaveButton onClick={onQuickSave} />
          )}
        </div>
      </div>
    </div>
  );
}
