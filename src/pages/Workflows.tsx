
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { ArrowLeft } from 'lucide-react';
import { AddApplianceDialog } from '@/components/appliance/AddApplianceDialog';
import { EditApplianceDialog } from '@/components/appliance/EditApplianceDialog';
import { ApplianceCard } from '@/components/appliance/ApplianceCard';
import { useAppliances } from '@/hooks/useAppliances';
import { toast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function Workflows() {
  const navigate = useNavigate();
  const [isReordering, setIsReordering] = useState(false);
  const [editingAppliance, setEditingAppliance] = useState<{index: number, name: string} | null>(null);
  const [deletingApplianceIndex, setDeletingApplianceIndex] = useState<number | null>(null);
  
  const {
    appliances,
    addAppliance,
    editAppliance,
    deleteAppliance,
    toggleWorkflow,
    moveAppliance,
    moveSymptom
  } = useAppliances();

  const getSymptomCardColor = (index: number) => {
    const colors = [
      'bg-[#E5DEFF] hover:bg-[#DCD2FF]',
      'bg-[#D3E4FD] hover:bg-[#C4DBFF]',
      'bg-[#FDE1D3] hover:bg-[#FFD4C2]',
      'bg-[#F2FCE2] hover:bg-[#E9F9D4]',
      'bg-[#FEF7CD] hover:bg-[#FFF2B8]',
      'bg-[#FFDEE2] hover:bg-[#FFD0D6]',
    ];
    return colors[index % colors.length];
  };

  const handleAddAppliance = (name: string) => {
    addAppliance(name);
    toast({
      title: "Appliance Added",
      description: `${name} has been added successfully.`
    });
  };

  const handleToggleWorkflow = (applianceIndex: number, symptomIndex: number) => {
    const symptom = toggleWorkflow(applianceIndex, symptomIndex);
    toast({
      title: symptom.isActive ? "Workflow Activated" : "Workflow Deactivated",
      description: `${symptom.name} has been ${symptom.isActive ? 'activated' : 'deactivated'}.`
    });
  };

  const handleDeleteAppliance = (index: number) => {
    deleteAppliance(index);
    setDeletingApplianceIndex(null);
    toast({
      title: "Appliance Deleted",
      description: "The appliance and its workflows have been deleted."
    });
  };

  const openWorkflowEditor = (applianceName: string, symptomName?: string) => {
    navigate('/', {
      state: { isNew: !symptomName },
      search: new URLSearchParams({
        ...(applianceName && { appliance: applianceName }),
        ...(symptomName && { symptom: symptomName })
      }).toString()
    });
  };

  const handleAddIssue = (applianceName: string) => {
    openWorkflowEditor(applianceName);
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Link to="/">
            <Button variant="ghost" size="icon" className="hover:bg-gray-100">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-[#14162F]">Appliances</h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Re-arrange:</span>
            <Switch checked={isReordering} onCheckedChange={setIsReordering} />
            <span className="text-sm font-medium">{isReordering ? 'ON' : 'OFF'}</span>
          </div>
          <AddApplianceDialog onSave={handleAddAppliance} />
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {appliances.map((appliance, index) => (
          <ApplianceCard
            key={appliance.name}
            appliance={appliance}
            index={index}
            isReordering={isReordering}
            onEdit={() => setEditingAppliance({ index, name: appliance.name })}
            onDelete={() => setDeletingApplianceIndex(index)}
            onToggleWorkflow={(symptomIndex) => handleToggleWorkflow(index, symptomIndex)}
            onMoveSymptom={(fromIndex, toIndex) => moveSymptom(index, fromIndex, toIndex)}
            onMoveAppliance={moveAppliance}
            onOpenWorkflowEditor={(symptomName) => openWorkflowEditor(appliance.name, symptomName)}
            onAddIssue={() => handleAddIssue(appliance.name)}
            getSymptomCardColor={getSymptomCardColor}
          />
        ))}
      </div>

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

      <AlertDialog 
        open={deletingApplianceIndex !== null} 
        onOpenChange={() => setDeletingApplianceIndex(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the appliance and all its workflows. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-500 hover:bg-red-600"
              onClick={() => {
                if (deletingApplianceIndex !== null) {
                  handleDeleteAppliance(deletingApplianceIndex);
                }
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
