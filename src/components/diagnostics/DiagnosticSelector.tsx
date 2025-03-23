
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, FileText, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SavedWorkflow } from '@/utils/flow/types';

export interface DiagnosticSelectorProps {
  workflows: SavedWorkflow[];
  onSelect: (workflow: SavedWorkflow) => void;
  selectedWorkflowId?: string;
  searchTerm?: string;
}

export function DiagnosticSelector({ 
  workflows, 
  onSelect, 
  selectedWorkflowId,
  searchTerm = '' 
}: DiagnosticSelectorProps) {
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);
  
  // Use the external search term if provided, otherwise use the local one
  const effectiveSearchTerm = searchTerm || localSearchTerm;

  const filteredWorkflows = workflows.filter(workflow => 
    workflow.metadata.name.toLowerCase().includes(effectiveSearchTerm.toLowerCase()) ||
    workflow.metadata.folder.toLowerCase().includes(effectiveSearchTerm.toLowerCase())
  );

  const getWorkflowId = (workflow: SavedWorkflow) => 
    workflow.id || `${workflow.metadata.folder}-${workflow.metadata.name}`;

  return (
    <Card className="w-full mb-6">
      <CardHeader className="pb-3">
        <CardTitle>Diagnostic Procedures</CardTitle>
        <CardDescription>Select a diagnostic procedure to follow</CardDescription>
      </CardHeader>
      <CardContent>
        {!searchTerm && (
          <div className="relative mb-4">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search diagnostics..." 
              className="pl-8"
              value={localSearchTerm}
              onChange={(e) => setLocalSearchTerm(e.target.value)}
            />
          </div>
        )}

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
                      Category: {workflow.metadata.folder} • {workflow.nodes.length} steps
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
              {effectiveSearchTerm ? 
                "No diagnostic procedures found matching your search." : 
                "No diagnostic procedures available."
              }
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
