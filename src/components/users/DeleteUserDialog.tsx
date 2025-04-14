
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUserManagementStore } from "@/store/userManagementStore";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";

interface DeleteUserDialogProps {
  userId: string;
  userName: string;
  isOpen: boolean;
  onClose: () => void;
  redirectPath?: string;
}

export function DeleteUserDialog({
  userId,
  userName,
  isOpen,
  onClose,
  redirectPath = "/admin/users",
}: DeleteUserDialogProps) {
  const { deleteUser } = useUserManagementStore();
  const navigate = useNavigate();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    
    try {
      const success = await deleteUser(userId);
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
      title="Delete User"
      description={`Are you sure you want to delete ${userName}? This action cannot be undone.`}
      confirmLabel={isDeleting ? "Deleting..." : "Delete User"}
      confirmVariant="destructive"
    />
  );
}
