
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search, Settings, FolderIcon } from 'lucide-react';
import { AddApplianceDialog } from '@/components/appliance/AddApplianceDialog';
import { useState } from 'react';
import { FolderManagement } from './FolderManagement';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface WorkflowHeaderProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  selectedFolder: string;
  onFolderChange: (folder: string) => void;
  folders: string[];
  isReordering: boolean;
  onReorderingChange?: (reordering: boolean) => void;
  onAddAppliance?: (name: string) => void;
  onFoldersRefresh?: () => void;
  onCreateWorkflow?: () => void;
}

export function WorkflowHeader({
  searchTerm,
  onSearchChange,
  selectedFolder,
  onFolderChange,
  folders,
  isReordering,
  onReorderingChange,
  onAddAppliance,
  onFoldersRefresh,
  onCreateWorkflow
}: WorkflowHeaderProps) {
  const [isAddApplianceDialogOpen, setIsAddApplianceDialogOpen] = useState(false);

  const handleFoldersChange = () => {
    if (onFoldersRefresh) {
      onFoldersRefresh();
    }
  };

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
          
          {onCreateWorkflow && (
            <Button onClick={onCreateWorkflow}>
              <Plus className="mr-2 h-4 w-4" />
              Create Workflow
            </Button>
          )}
          
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
        
        {onFoldersRefresh && (
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="ml-2"
              >
                <FolderIcon className="h-4 w-4 mr-1" />
                Manage Folders
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80" align="end">
              <FolderManagement 
                folders={folders}
                onFoldersChange={handleFoldersChange}
              />
            </PopoverContent>
          </Popover>
        )}
      </div>
      
      {onAddAppliance && (
        <AddApplianceDialog
          open={isAddApplianceDialogOpen}
          onClose={() => setIsAddApplianceDialogOpen(false)}
          onAddAppliance={onAddAppliance}
        />
      )}
      
      {isReordering && (
        <div className="bg-amber-50 border border-amber-200 p-3 rounded-md mt-4">
          <p className="text-sm text-amber-600 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Drag and drop workflows to reorder them within a folder or drag them between folder containers to move them
          </p>
        </div>
      )}
    </div>
  );
}
