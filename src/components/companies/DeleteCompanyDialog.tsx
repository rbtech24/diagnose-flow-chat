
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUserManagementStore } from "@/store/userManagementStore";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";

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

  const handleDelete = async () => {
    setIsDeleting(true);
    
    try {
      const success = await deleteCompany(companyId);
      if (success && redirectPath) {
        navigate(redirectPath);
      } else {
        onClose();
      }
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <ConfirmationDialog
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={handleDelete}
      title="Delete Company"
      description={`Are you sure you want to delete ${companyName}? This action will permanently remove this company and all associated data. This action cannot be undone.`}
      confirmLabel={isDeleting ? "Deleting..." : "Delete Company"}
      confirmVariant="destructive"
    />
  );
}
