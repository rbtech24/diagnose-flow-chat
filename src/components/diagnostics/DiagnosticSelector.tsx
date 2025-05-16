
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, FileText, ArrowRight, FolderOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SavedWorkflow } from '@/utils/flow/types';

interface DiagnosticSelectorProps {
  workflows: SavedWorkflow[];
  folders?: string[];
  onSelect: (workflow: SavedWorkflow) => void;
  onSelectFolder?: (folder: string) => void;
  selectedWorkflowId?: string;
  title?: string;
  showFolders?: boolean;
}

export function DiagnosticSelector({ 
  workflows, 
  folders = [], 
  onSelect, 
  onSelectFolder,
  selectedWorkflowId,
  title = "Diagnostic Procedures",
  showFolders = false
}: DiagnosticSelectorProps) {
  const [searchTerm, setSearchTerm] = useState('');

  // Get unique folders from workflows
  const uniqueFolders = showFolders
    ? [...new Set([...folders, ...workflows.map(w => w.metadata.folder || w.metadata.appliance || 'General')])]
        .filter(f => f && f.trim() !== '')
        .sort()
    : [];

  // Filter workflows by search term
  const filteredWorkflows = workflows.filter(workflow => 
    workflow.metadata.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (workflow.metadata.folder || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (workflow.metadata.appliance || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Filter folders by search term
  const filteredFolders = uniqueFolders.filter(folder =>
    folder.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getWorkflowId = (workflow: SavedWorkflow) => 
    `${workflow.metadata.folder || workflow.metadata.appliance || 'General'}-${workflow.metadata.name}`;

  return (
    <Card className="w-full mb-6">
      <CardHeader className="pb-3">
        <CardTitle>{title}</CardTitle>
        <CardDescription>
          {showFolders 
            ? "Select an appliance category" 
            : "Select a diagnostic procedure to follow"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative mb-4">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder={showFolders ? "Search categories..." : "Search diagnostics..."} 
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {showFolders && (
          <div className="space-y-3 mb-6">
            {filteredFolders.length > 0 ? (
              filteredFolders.map(folder => (
                <div 
                  key={folder}
                  className="p-3 border rounded-lg flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => onSelectFolder && onSelectFolder(folder)}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                      <FolderOpen className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-medium">{folder}</h3>
                      <p className="text-sm text-muted-foreground">
                        {workflows.filter(w => 
                          (w.metadata.folder === folder || w.metadata.appliance === folder) && 
                          w.metadata.isActive !== false
                        ).length} diagnostic procedures
                      </p>
                    </div>
                  </div>
                  <Button size="sm" variant="ghost" className="flex items-center gap-1">
                    View <ArrowRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              ))
            ) : (
              <div className="text-center py-6 text-muted-foreground">
                {searchTerm ? 
                  "No appliance categories found matching your search." : 
                  "No appliance categories available."
                }
              </div>
            )}
          </div>
        )}

        {(!showFolders || filteredWorkflows.length > 0) && (
          <div className="space-y-3">
            {filteredWorkflows.length > 0 ? (
              filteredWorkflows.map(workflow => (
                <div 
                  key={getWorkflowId(workflow)}
                  className={`p-3 border rounded-lg flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors ${
                    selectedWorkflowId === getWorkflowId(workflow) ? 'border-blue-500 bg-blue-50' : ''
                  }`}
                  onClick={() => onSelect(workflow)}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                      <FileText className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">{workflow.metadata.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        Category: {workflow.metadata.folder || workflow.metadata.appliance || 'General'} • {workflow.nodes.length} steps
                      </p>
                    </div>
                  </div>
                  <Button size="sm" variant="ghost" className="flex items-center gap-1">
                    Start <ArrowRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              ))
            ) : (
              <div className="text-center py-6 text-muted-foreground">
                {searchTerm ? 
                  "No diagnostic procedures found matching your search." : 
                  "No diagnostic procedures available."
                }
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
