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
import { Input } from '@/components/ui/input';

export default function Workflows() {
  const navigate = useNavigate();
  const [isReordering, setIsReordering] = useState(false);
  const [editingAppliance, setEditingAppliance] = useState<{index: number, name: string} | null>(null);
  const [deletingApplianceIndex, setDeletingApplianceIndex] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFolder, setSelectedFolder] = useState<string>('');
  
  const {
    appliances,
    addAppliance,
    editAppliance,
    deleteAppliance,
    toggleWorkflow,
    moveAppliance,
    moveSymptom
  } = useAppliances();

  const folders = [...new Set(appliances.map(a => a.name))];
  
  const filteredAppliances = appliances
    .filter(appliance => 
      (selectedFolder ? appliance.name === selectedFolder : true) &&
      (searchTerm ? 
        appliance.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        appliance.symptoms.some(s => s.name.toLowerCase().includes(searchTerm.toLowerCase()))
        : true
      )
    );

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
    const params = new URLSearchParams();
    if (applianceName) params.set('appliance', applianceName);
    if (symptomName) params.set('symptom', symptomName);
    if (!symptomName) params.set('new', 'true');
    
    navigate({
      pathname: '/',
      search: params.toString(),
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
            <Input
              placeholder="Search appliances and workflows..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-64"
            />
            <select
              className="px-3 py-2 border border-gray-300 rounded-md"
              value={selectedFolder}
              onChange={(e) => setSelectedFolder(e.target.value)}
            >
              <option value="">All Folders</option>
              {folders.map((folder) => (
                <option key={folder} value={folder}>{folder}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Re-arrange:</span>
            <Switch checked={isReordering} onCheckedChange={setIsReordering} />
            <span className="text-sm font-medium">{isReordering ? 'ON' : 'OFF'}</span>
          </div>
          <AddApplianceDialog onSave={handleAddAppliance} />
        </div>
      </div>

      {filteredAppliances.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No appliances found matching your search criteria.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAppliances.map((appliance, index) => (
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
      )}

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
