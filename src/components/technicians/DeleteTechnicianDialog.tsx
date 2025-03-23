
import { Button } from "@/components/ui/button";
import { Archive } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/components/ui/alert-dialog";

interface DeleteTechnicianDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onDelete: () => void;
  onArchive: () => void;
}

export function DeleteTechnicianDialog({ 
  isOpen, 
  onClose, 
  onDelete, 
  onArchive 
}: DeleteTechnicianDialogProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to permanently delete this technician? This action cannot be undone.
            Consider archiving instead to retain their data and history.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose}>
            Cancel
          </AlertDialogCancel>
          <Button 
            variant="outline" 
            className="border-amber-500 text-amber-600 hover:bg-amber-50"
            onClick={onArchive}
          >
            <Archive className="h-4 w-4 mr-2" />
            Archive Instead
          </Button>
          <AlertDialogAction
            className="bg-red-500 hover:bg-red-600"
            onClick={onDelete}
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
