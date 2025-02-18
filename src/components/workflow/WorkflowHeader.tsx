
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { ArrowLeft } from 'lucide-react';
import { AddApplianceDialog } from '@/components/appliance/AddApplianceDialog';

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
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-64"
          />
          <select
            className="px-3 py-2 border border-gray-300 rounded-md"
            value={selectedFolder}
            onChange={(e) => onFolderChange(e.target.value)}
          >
            <option value="">All Folders</option>
            {folders.map((folder) => (
              <option key={folder} value={folder}>
                {folder}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Re-arrange:</span>
          <Switch checked={isReordering} onCheckedChange={onReorderingChange} />
          <span className="text-sm font-medium">{isReordering ? 'ON' : 'OFF'}</span>
        </div>
        <AddApplianceDialog onSave={onAddAppliance} />
      </div>
    </div>
  );
}
