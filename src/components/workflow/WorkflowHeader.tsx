
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search, Settings } from 'lucide-react';
import { AddApplianceDialog } from '@/components/appliance/AddApplianceDialog';
import { useState } from 'react';

interface WorkflowHeaderProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  selectedFolder: string;
  onFolderChange: (folder: string) => void;
  folders: string[];
  isReordering: boolean;
  onReorderingChange?: (reordering: boolean) => void;
  onAddAppliance?: (name: string) => void;
}

export function WorkflowHeader({
  searchTerm,
  onSearchChange,
  selectedFolder,
  onFolderChange,
  folders,
  isReordering,
  onReorderingChange,
  onAddAppliance
}: WorkflowHeaderProps) {
  const [isAddApplianceDialogOpen, setIsAddApplianceDialogOpen] = useState(false);

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold">Workflows</h1>
          <p className="text-muted-foreground">
            {onReorderingChange 
              ? "Manage and organize diagnostic workflows for your appliances" 
              : "View diagnostic workflows for appliances"}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search..." 
              className="pl-8 min-w-[250px]"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
          
          {onAddAppliance && (
            <Button onClick={() => setIsAddApplianceDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Appliance
            </Button>
          )}
          
          {onReorderingChange && (
            <Button 
              variant={isReordering ? "default" : "outline"} 
              onClick={() => onReorderingChange(!isReordering)}
            >
              <Settings className="mr-2 h-4 w-4" />
              {isReordering ? "Done Reordering" : "Reorder"}
            </Button>
          )}
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button
          variant={selectedFolder === "" ? "default" : "outline"}
          size="sm"
          onClick={() => onFolderChange("")}
        >
          All
        </Button>
        
        {folders.map((folder) => (
          <Button
            key={folder}
            variant={selectedFolder === folder ? "default" : "outline"}
            size="sm"
            onClick={() => onFolderChange(folder)}
          >
            {folder}
          </Button>
        ))}
      </div>
      
      {onAddAppliance && (
        <AddApplianceDialog
          open={isAddApplianceDialogOpen}
          onClose={() => setIsAddApplianceDialogOpen(false)}
          onAddAppliance={onAddAppliance}
        />
      )}
    </div>
  );
}
