
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUserManagementStore } from "@/store/userManagementStore";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import { toast } from "react-hot-toast";
import { AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface DeleteCompanyDialogProps {
  companyId: string;
  companyName: string;
  isOpen: boolean;
  onClose: () => void;
  redirectPath?: string;
}

export function DeleteCompanyDialog({
  companyId,
  companyName,
  isOpen,
  onClose,
  redirectPath = "/admin/companies",
}: DeleteCompanyDialogProps) {
  const { deleteCompany } = useUserManagementStore();
  const navigate = useNavigate();
  const [isDeleting, setIsDeleting] = useState(false);
  const [confirmName, setConfirmName] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    if (confirmName !== companyName) {
      setError("Company name doesn't match");
      return;
    }
    
    setError(null);
    setIsDeleting(true);
    
    try {
      const success = await deleteCompany(companyId);
      if (success) {
        toast.success(`Company "${companyName}" has been deleted successfully`);
        onClose();
        if (redirectPath) {
          navigate(redirectPath);
        }
      } else {
        toast.error("Failed to delete company. Please try again.");
        onClose();
      }
    } catch (error) {
      console.error("Error deleting company:", error);
      toast.error("An error occurred while deleting the company.");
      onClose();
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <ConfirmationDialog
      isOpen={isOpen}
      onClose={() => {
        setConfirmName("");
        setError(null);
        onClose();
      }}
      onConfirm={handleDelete}
      title="Delete Company"
      description={
        <>
          <p className="mb-4">
            Are you sure you want to delete <strong>{companyName}</strong>? This action will permanently remove this company and all associated data. This action cannot be undone.
          </p>
          <div className="space-y-2">
            <Label htmlFor="confirm-name" className="text-sm font-medium">
              Type <strong>{companyName}</strong> to confirm deletion:
            </Label>
            <Input
              id="confirm-name"
              value={confirmName}
              onChange={(e) => setConfirmName(e.target.value)}
              placeholder={`Type "${companyName}" to confirm`}
              autoComplete="off"
            />
            {error && (
              <div className="flex items-center text-red-500 text-sm mt-1">
                <AlertCircle className="h-4 w-4 mr-1" />
                {error}
              </div>
            )}
          </div>
        </>
      }
      confirmLabel={isDeleting ? "Deleting..." : "Delete Company"}
      confirmVariant="destructive"
      confirmDisabled={confirmName !== companyName || isDeleting}
    />
  );
}
