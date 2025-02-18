import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Plus } from 'lucide-react';
import { AddApplianceDialog } from '@/components/appliance/AddApplianceDialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface WorkflowHeaderProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedFolder: string;
  onFolderChange: (folder: string) => void;
  folders: string[];
  isReordering: boolean;
  onReorderingChange: (value: boolean) => void;
  onAddAppliance: (name: string) => void;
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
}: WorkflowHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-4">
        <h1 className="text-2xl font-bold text-[#14162F]">Appliances</h1>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Input
            placeholder="Search appliances and workflows..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-64"
          />
          <Select
            value={selectedFolder || "all_folders"}
            onValueChange={(value) => onFolderChange(value === "all_folders" ? "" : value)}
          >
            <SelectTrigger className="w-[180px] bg-white">
              <SelectValue placeholder="All Folders" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all_folders">All Folders</SelectItem>
              {folders.map((folder) => (
                <SelectItem key={folder} value={folder}>
                  {folder}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Re-arrange:</span>
          <Switch checked={isReordering} onCheckedChange={onReorderingChange} />
          <span className="text-sm font-medium">{isReordering ? 'ON' : 'OFF'}</span>
        </div>
        <Button className="bg-[#8B5CF6] hover:bg-[#7C3AED] text-white gap-2" asChild>
          <Link to="/workflow-editor?new=true">
            <Plus className="h-4 w-4" />
            New Workflow
          </Link>
        </Button>
        <AddApplianceDialog onSave={onAddAppliance} />
      </div>
    </div>
  );
}
