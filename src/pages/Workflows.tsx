
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, FolderOpen } from 'lucide-react';
import { getFolders, getWorkflowsInFolder } from '@/utils/flowUtils';

export default function Workflows() {
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const folders = getFolders();

  const workflows = selectedFolder ? getWorkflowsInFolder(selectedFolder) : [];

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center gap-4 mb-6">
        <Link to="/">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">Saved Workflows</h1>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {folders.map((folder) => (
          <Card 
            key={folder}
            className={`p-4 cursor-pointer transition-colors ${
              selectedFolder === folder ? 'border-primary' : ''
            }`}
            onClick={() => setSelectedFolder(folder)}
          >
            <div className="flex items-center gap-2">
              <FolderOpen className="h-5 w-5 text-primary" />
              <h3 className="font-semibold">{folder}</h3>
            </div>
          </Card>
        ))}
      </div>

      {selectedFolder && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">
            Workflows in {selectedFolder}
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {workflows.map((workflow) => (
              <Card key={workflow.metadata.name} className="p-4">
                <h3 className="font-medium">{workflow.metadata.name}</h3>
                <p className="text-sm text-gray-500 mt-1">
                  Last updated: {new Date(workflow.metadata.updatedAt).toLocaleDateString()}
                </p>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
