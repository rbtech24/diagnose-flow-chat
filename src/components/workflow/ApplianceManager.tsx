
import { EditApplianceDialog } from '@/components/appliance/EditApplianceDialog';
import { DeleteApplianceDialog } from '@/components/workflow/DeleteApplianceDialog';
import { toast } from '@/hooks/use-toast';

interface ApplianceManagerProps {
  editingAppliance: { index: number; name: string } | null;
  setEditingAppliance: (appliance: { index: number; name: string } | null) => void;
  deletingApplianceIndex: number | null;
  setDeletingApplianceIndex: (index: number | null) => void;
  editAppliance: (index: number, newName: string) => void;
  deleteAppliance: (index: number) => void;
}

export function ApplianceManager({
  editingAppliance,
  setEditingAppliance,
  deletingApplianceIndex,
  setDeletingApplianceIndex,
  editAppliance,
  deleteAppliance,
}: ApplianceManagerProps) {
  const handleDeleteAppliance = (index: number) => {
    deleteAppliance(index);
    setDeletingApplianceIndex(null);
    toast({
      title: "Appliance Deleted",
      description: "The appliance and its workflows have been deleted."
    });
  };

  return (
    <>
      {editingAppliance && (
        <EditApplianceDialog
          applianceName={editingAppliance.name}
          isOpen={true}
          onClose={() => setEditingAppliance(null)}
          onSave={(newName) => {
            editAppliance(editingAppliance.index, newName);
            setEditingAppliance(null);
          }}
        />
      )}

      <DeleteApplianceDialog
        isOpen={deletingApplianceIndex !== null}
        onClose={() => setDeletingApplianceIndex(null)}
        onConfirm={() => {
          if (deletingApplianceIndex !== null) {
            handleDeleteAppliance(deletingApplianceIndex);
          }
        }}
      />
    </>
  );
}
