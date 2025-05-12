
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { FolderPlus, FolderEdit, Trash } from 'lucide-react';
import { addFolder, deleteFolder, renameFolder } from '@/utils/flow/storage/workflow-operations/manage-folders';

interface FolderManagementProps {
  folders: string[];
  onFoldersChange: () => void;
}

export function FolderManagement({ folders, onFoldersChange }: FolderManagementProps) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isRenameDialogOpen, setIsRenameDialogOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [selectedFolder, setSelectedFolder] = useState('');
  const [newName, setNewName] = useState('');

  const handleAddFolder = async () => {
    if (!newFolderName.trim()) {
      toast({
        title: "Error",
        description: "Folder name cannot be empty",
        variant: "destructive"
      });
      return;
    }

    if (folders.includes(newFolderName)) {
      toast({
        title: "Error",
        description: "A folder with this name already exists",
        variant: "destructive"
      });
      return;
    }

    const success = await addFolder(newFolderName);
    if (success) {
      setNewFolderName('');
      setIsAddDialogOpen(false);
      onFoldersChange();
    }
  };

  const handleDeleteFolder = async () => {
    if (selectedFolder === 'Default') {
      toast({
        title: "Error",
        description: "Cannot delete the Default folder",
        variant: "destructive"
      });
      return;
    }

    const success = await deleteFolder(selectedFolder);
    if (success) {
      setSelectedFolder('');
      setIsDeleteDialogOpen(false);
      onFoldersChange();
    }
  };

  const handleRenameFolder = async () => {
    if (!newName.trim()) {
      toast({
        title: "Error",
        description: "New folder name cannot be empty",
        variant: "destructive"
      });
      return;
    }

    if (folders.includes(newName)) {
      toast({
        title: "Error",
        description: "A folder with this name already exists",
        variant: "destructive"
      });
      return;
    }

    const success = await renameFolder(selectedFolder, newName);
    if (success) {
      setSelectedFolder('');
      setNewName('');
      setIsRenameDialogOpen(false);
      onFoldersChange();
    }
  };

  const openRenameDialog = (folder: string) => {
    setSelectedFolder(folder);
    setNewName(folder);
    setIsRenameDialogOpen(true);
  };

  const openDeleteDialog = (folder: string) => {
    setSelectedFolder(folder);
    setIsDeleteDialogOpen(true);
  };

  return (
    <div>
      <Button 
        variant="outline" 
        size="sm" 
        onClick={() => setIsAddDialogOpen(true)}
        className="flex items-center gap-1"
      >
        <FolderPlus className="h-4 w-4" />
        Add Folder
      </Button>

      {/* Add Folder Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Folder</DialogTitle>
            <DialogDescription>
              Create a new folder for organizing your workflows.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="folder-name">Folder Name</Label>
              <Input 
                id="folder-name" 
                placeholder="Enter folder name" 
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleAddFolder}>Create Folder</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Folder Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Folder</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the folder "{selectedFolder}"?
              Any workflows in this folder will be moved to the Default folder or deleted.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDeleteFolder}>Delete Folder</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Rename Folder Dialog */}
      <Dialog open={isRenameDialogOpen} onOpenChange={setIsRenameDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rename Folder</DialogTitle>
            <DialogDescription>
              Enter a new name for the folder "{selectedFolder}".
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="new-folder-name">New Folder Name</Label>
              <Input 
                id="new-folder-name" 
                placeholder="Enter new folder name" 
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRenameDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleRenameFolder}>Rename Folder</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Folder Management */}
      <div className="mt-4">
        <h3 className="text-sm font-medium mb-2">Manage Folders</h3>
        <div className="space-y-2">
          {folders.map((folder) => (
            <div key={folder} className="flex items-center justify-between p-2 border rounded-md">
              <span>{folder}</span>
              <div className="flex items-center gap-2">
                {folder !== 'Default' && (
                  <>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => openRenameDialog(folder)}
                    >
                      <FolderEdit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => openDeleteDialog(folder)}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
