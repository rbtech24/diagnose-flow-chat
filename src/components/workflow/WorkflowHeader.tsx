
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search, Settings, FolderIcon } from 'lucide-react';
import { AddApplianceDialog } from '@/components/appliance/AddApplianceDialog';
import { useState } from 'react';
import { FolderManagement } from './FolderManagement';
import { useNavigate } from 'react-router-dom';
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
  onFoldersRefresh
}: WorkflowHeaderProps) {
  const [isAddApplianceDialogOpen, setIsAddApplianceDialogOpen] = useState(false);
  const navigate = useNavigate();

  const handleFoldersChange = () => {
    if (onFoldersRefresh) {
      onFoldersRefresh();
    }
  };

  const handleCreateWorkflow = () => {
    // Check user role to determine the correct path
    const isAdminPath = window.location.pathname.includes('/admin');
    const editorPath = isAdminPath ? '/admin/workflow-editor' : '/workflow-editor';
    
    // Add ?new=true to indicate this is a new workflow
    navigate(`${editorPath}?new=true`);
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
          
          <Button onClick={handleCreateWorkflow}>
            <Plus className="mr-2 h-4 w-4" />
            Create Workflow
          </Button>
          
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
    </div>
  );
}
