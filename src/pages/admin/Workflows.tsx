
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Search, Workflow, FileText } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Link, useNavigate } from "react-router-dom";
import { useWorkflows } from "@/hooks/useWorkflows";
import toast from "react-hot-toast";

export default function AdminWorkflows() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const { workflows } = useWorkflows();
  
  // Filter workflows based on search term
  const filteredWorkflows = workflows.filter(workflow => 
    workflow.metadata.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    workflow.metadata.folder.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateWorkflow = () => {
    console.log("Navigating to workflow editor");
    // Make sure we're explicitly going to /admin/workflow-editor
    navigate('/admin/workflow-editor?new=true');
  };

  const handleEditWorkflow = (folder: string, name: string) => {
    navigate(`/admin/workflow-editor?folder=${encodeURIComponent(folder)}&name=${encodeURIComponent(name)}`);
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Workflows</h1>
          <p className="text-muted-foreground">Manage diagnosis workflows across the platform</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search workflows..." 
              className="pl-8 w-[250px]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button onClick={handleCreateWorkflow}>
            <Plus className="h-4 w-4 mr-2" />
            Create Workflow
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>All Workflows</CardTitle>
            <CardDescription>
              {filteredWorkflows.length} workflow{filteredWorkflows.length !== 1 ? 's' : ''} available in the system
            </CardDescription>
          </CardHeader>
          <CardContent>
            {filteredWorkflows.length > 0 ? (
              <div className="space-y-4">
                {filteredWorkflows.map((workflow) => (
                  <div key={`${workflow.metadata.folder}-${workflow.metadata.name}`} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                        <FileText className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium">{workflow.metadata.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          Folder: {workflow.metadata.folder}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex items-center gap-1">
                            <div className={`h-2 w-2 rounded-full ${workflow.nodes.length > 0 ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                            <span className="text-xs text-gray-500">{workflow.nodes.length} steps</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant={workflow.metadata.isActive ? "secondary" : "outline"}>
                        {workflow.metadata.isActive ? "Active" : "Inactive"}
                      </Badge>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleEditWorkflow(workflow.metadata.folder, workflow.metadata.name)}
                      >
                        Edit Workflow
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                {searchTerm ? 
                  "No workflows found matching your search." : 
                  "No workflows available. Click 'Create Workflow' to add one."}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
