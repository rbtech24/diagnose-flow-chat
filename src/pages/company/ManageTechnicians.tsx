
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Plus, Loader2 } from "lucide-react";
import { TechnicianList } from "@/components/technicians/TechnicianList";
import { InviteList } from "@/components/technicians/InviteList";
import { AddTechnicianDialog } from "@/components/technicians/AddTechnicianDialog";
import { DeleteTechnicianDialog } from "@/components/technicians/DeleteTechnicianDialog";
import { TechnicianUsageCard } from "@/components/technicians/TechnicianUsageCard";
import { useTechnicianData } from "@/hooks/technicians/useTechnicianData";
import ErrorBoundary from "@/components/ErrorBoundary";

export default function ManageTechnicians() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [techToDelete, setTechToDelete] = useState<string | null>(null);
  
  const {
    technicians,
    invites,
    technicianLimits,
    isLoading,
    handleAddTechnician,
    handleCancelInvite,
    handleDeleteTechnician,
    handleArchiveTechnician
  } = useTechnicianData();

  const confirmDeleteTechnician = (techId: string) => {
    setTechToDelete(techId);
    setIsDeleteDialogOpen(true);
  };

  const handleAddTechnicianSubmit = async (data: { name: string; email: string; phone: string }) => {
    const success = await handleAddTechnician(data);
    if (success) {
      setIsAddDialogOpen(false);
    }
  };

  const handleExecuteDelete = () => {
    if (techToDelete) {
      handleDeleteTechnician(techToDelete);
      setIsDeleteDialogOpen(false);
      setTechToDelete(null);
    }
  };

  const handleExecuteArchive = () => {
    if (techToDelete) {
      handleArchiveTechnician(techToDelete);
      setIsDeleteDialogOpen(false);
      setTechToDelete(null);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="mt-2 text-gray-500">Loading technician data...</p>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="container mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Technician Management</h1>
            <p className="text-gray-500">Manage your technician accounts</p>
          </div>
          <Button 
            onClick={() => setIsAddDialogOpen(true)}
            disabled={technicianLimits.isAtLimit}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Technician
          </Button>
        </div>

        <TechnicianUsageCard limits={technicianLimits} />

        <Separator className="my-6" />

        <div className="grid gap-6">
          <TechnicianList 
            technicians={technicians} 
            onArchive={handleArchiveTechnician}
            onDelete={confirmDeleteTechnician}
          />

          <InviteList 
            invites={invites} 
            onCancel={handleCancelInvite}
          />
        </div>

        <AddTechnicianDialog 
          isOpen={isAddDialogOpen} 
          onClose={() => setIsAddDialogOpen(false)}
          onSubmit={handleAddTechnicianSubmit}
        />

        <DeleteTechnicianDialog 
          isOpen={isDeleteDialogOpen}
          onClose={() => setIsDeleteDialogOpen(false)}
          onDelete={handleExecuteDelete}
          onArchive={handleExecuteArchive}
        />
      </div>
    </ErrorBoundary>
  );
}
